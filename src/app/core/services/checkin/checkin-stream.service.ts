import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
    CheckinStreamMessage,
    InitialSnapshotEvent,
    CheckinEventMessage,
} from '../../models/checkin/checkinEvent.model';
import { CreateCheckinRequest } from '../../models/checkin/createCheckinRequest.model';
import Keycloak from 'keycloak-js';
import { environment } from '../../../../environments/environment';
import { inject, Injectable, signal } from '@angular/core';
import {CheckinActionType, CheckinEventType} from '../../models/checkin/checkinTypes.model';
import {toObservable} from '@angular/core/rxjs-interop';
import {CheckinDto} from '../../models/checkin/checkin.model';

@Injectable({ providedIn: 'root' })
export class CheckinStreamService {
    private socket?: WebSocketSubject<CheckinStreamMessage | CreateCheckinRequest>;
    private _entries = signal<CheckinDto[]>([]);
    readonly entries$ = toObservable(this._entries);

    private readonly keycloak = inject(Keycloak);

    connect(conferenceId: string) {
        const urlBase = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const url =
            `${urlBase}//${environment.BASE_API_URL_SHORT}` +
            `/api/interactions/ws/checkins?conferenceId=${conferenceId}`;

        this.socket = webSocket<CheckinStreamMessage | CreateCheckinRequest>({
            url,
            // patch the field name before handing it to the rest of your code:
            deserializer: (e) => {
                const obj: any = JSON.parse(e.data);
                if ('type' in obj) {
                    obj.eventType = obj.type;
                    delete obj.type;
                }
                return obj;
            },
            openObserver:  { next: () => console.log('WS opened') },
            closeObserver: { next: e  => console.log('WS closed', e) },
        });

        this.socket.subscribe({
            next: (raw) => {
                console.log('[CheckinStreamService] after rename →', raw);
                if (
                    raw != null &&
                    typeof raw === 'object' &&
                    'eventType' in raw
                ) {
                    this.handleMessage(raw as CheckinStreamMessage);
                }
            },
            error: (err) => console.error('WebSocket error', err),
            complete: () => console.log('WebSocket closed'),
        });
    }

    disconnect() {
        this.socket?.complete();
        this.socket = undefined;
        this._entries.set([]);
    }

    sendCheckin(sessionId: string, conferenceId: string) {
        if (!this.socket) {
            console.error('WebSocket not connected!');
            return;
        }
        const req: CreateCheckinRequest = {
            type: CheckinActionType.CHECK_IN,
            userId: this.keycloak.tokenParsed?.sub || '',
            conferenceId,
            sessionId,
        };
        this.socket.next(req);
    }

    private handleMessage(msg: CheckinStreamMessage) {
        switch (msg.eventType) {
            case CheckinEventType.INITIAL_SNAPSHOT:
                this._entries.set((msg as InitialSnapshotEvent).checkins);
                break;

            case CheckinEventType.CHECK_IN:
            case CheckinEventType.CHECK_OUT:
                const ev = msg as CheckinEventMessage;
                this._entries.update(arr => [...arr, ev.checkin]);
                break;
        }
    }
}
