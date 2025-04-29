// src/app/core/services/checkin/checkin-stream.service.ts
import {inject, Injectable, signal} from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { toObservable } from '@angular/core/rxjs-interop';
import {
    CheckinStreamMessage,
    CheckinSnapshotEntry, CheckinEventType, CheckinEvent,
} from '../../models/checkin/checkinEvent.model';
import { CreateCheckinRequest } from '../../models/checkin/createCheckinRequest.model';
import Keycloak from 'keycloak-js';
import {Environment} from '@angular/cli/lib/config/workspace-schema';
import {environment} from '../../../../environments/environment';

function isStreamMsg(value: any): value is CheckinStreamMessage {
    return (
        value != null &&
        typeof value === 'object' &&
        'eventType' in value &&
        (value as any).conferenceId !== undefined
    );
}

@Injectable({ providedIn: 'root' })
export class CheckinStreamService {
    private socket?: WebSocketSubject<CheckinStreamMessage | CreateCheckinRequest>;
    private _entries = signal<CheckinSnapshotEntry[]>([]);
    readonly entries$ = toObservable(this._entries);
    private readonly keycloak = inject(Keycloak);
    private readonly token = this.keycloak.token || '';

    connect(conferenceId: string) {

        const urlBase = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const url =
            `${urlBase}//${environment.BASE_API_URL_SHORT}/api/interactions/ws/checkins` + `?conferenceId=${conferenceId}`;
        //this.socket = webSocket<CheckinStreamMessage | CreateCheckinRequest>({ url, deserializer: e => JSON.parse(e.data) });
        this.socket = webSocket<CheckinStreamMessage | CreateCheckinRequest>({
            url,
            deserializer: e => JSON.parse(e.data),
            openObserver: { next: () => console.log('WS opened') },
            closeObserver: { next: e => console.log('WS closed', e) },
        });
        this.socket.subscribe({
            next: raw => {
                if (isStreamMsg(raw)) {
                    this.handleMessage(raw);
                }
            },
            error: err => console.error('WebSocket error', err),
            complete: () => console.log('WebSocket closed')
        });

    }

    disconnect() {
        this.socket?.complete();
        this.socket = undefined;
        this._entries.set([]);
    }

    sendCheckin(req: CreateCheckinRequest) {
        if (!this.socket) {
            console.error('WebSocket not connected!');
            return;
        }
        this.socket.next(req);
    }

    private handleMessage(msg: CheckinStreamMessage) {
        switch (msg.eventType) {
            case CheckinEventType.INITIAL_SNAPSHOT:
                this._entries.set(msg.checkins);
                break;
            case CheckinEventType.CHECKIN:
                const e = msg as CheckinEvent;
                this._entries.update(arr => [
                    ...arr,
                    { sessionId: e.sessionId, userId: e.userId, firstName: e.firstName, lastName: e.lastName }
                ]);
                break;
        }
    }

}
