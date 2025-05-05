import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    inject,
    ChangeDetectorRef,
    WritableSignal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConferenceHeroComponent } from '../conference-hero/conference-hero.component';
import { ConferenceMetaComponent } from '../conference-meta/conference-meta.component';
import { ConferenceLocationComponent } from '../conference-location/conference-location.component';
import {SessionsTabsComponent} from '../session-tabs/session-tabs.component';
import {Conference} from '../../../../core/models/conference/conference.model';
import {SessionDetailsDto} from '../../../../core/models/session/session.model';
import {ConferenceService} from '../../../../core/services/conference/conference.service';
import {SessionService} from '../../../../core/services/session/session.service';
import {SessionImportDialogComponent} from '../../../sessions/session-import-dialog/session-import-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {CheckinStreamService} from '../../../../core/services/checkin/checkin-stream.service';
import Keycloak from 'keycloak-js';
import {CreateCheckinRequest} from '../../../../core/models/checkin/createCheckinRequest.model';
import {Subscription} from 'rxjs';
import { signal } from '@angular/core';
import {TimeGroup} from '../time-group/time-group.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {CheckinActionType} from '../../../../core/models/checkin/checkinTypes.model';
import {organizeSessions} from '../../../../core/utils/session-organizer';
import {CheckinDto} from '../../../../core/models/checkin/checkin.model';

@Component({
    standalone: true,
    selector: 'app-conference-details',
    imports: [
        CommonModule,
        ConferenceHeroComponent,
        ConferenceMetaComponent,
        ConferenceLocationComponent,
        SessionsTabsComponent,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './conference-details-container.component.html',
    styleUrls: ['./conference-details-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConferenceDetailsContainerComponent implements OnInit, OnDestroy {
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly conferenceService: ConferenceService = inject(ConferenceService);
    private readonly sessionService: SessionService = inject(SessionService);
    private readonly checkinStream: CheckinStreamService = inject(CheckinStreamService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly keycloak: Keycloak = inject(Keycloak);

    conferenceId!: string;
    conference: Conference | null = null;
    sessions: SessionDetailsDto[] = [];
    sessionDates: Date[] = [];
    groupedByDate: Record<string, TimeGroup[]> = {};
    loading: WritableSignal<boolean>= signal(true);
    error: string | null = null;
    checkinCounts: Record<string, number> = {};
    checkinSub?: Subscription;
    dialog: MatDialog = inject(MatDialog);
    sessionCheckins: Record<string, CheckinDto[]> = {};
    currentUserId = this.keycloak.tokenParsed?.sub ?? '';
    checkedInSessionIds = new Set<string>();


    ngOnInit() {
        this.conferenceId = this.route.snapshot.paramMap.get('id') || '';
        this.loadConference();
    }

    ngOnDestroy() {
        this.checkinSub?.unsubscribe();
        this.checkinStream.disconnect();
    }

    private loadConference() {
        this.conferenceService.getConference(this.conferenceId).subscribe({
            next: conf => {
                this.conference = conf;
                this.loadSessions();
            },
            error: () => {
                this.error = 'Failed to load conference';
                this.loading.set(false);
            }
        });
    }

    private loadSessions() {
        this.sessionService.getSessionsByConferenceId(this.conferenceId).subscribe({
            next: sessions => {
                this.sessions = sessions;
                console.log('Sessions loaded:', sessions);
                this.organizeSessions();
                console.log('Organizing sessions');
                this.connectCheckinStream();
                console.log('Checkin stream connected');
                this.loading.set(false);
                console.log('Loading finished');
            }
        });
    }

    private organizeSessions() {
        const { dates, grouped } = organizeSessions(this.sessions);
        this.sessionDates  = dates;
        this.groupedByDate = grouped;
        this.cdr.markForCheck();
    }

    private connectCheckinStream() {
        this.checkinStream.connect(this.conferenceId);
        this.checkinSub = this.checkinStream.entries$.subscribe(all => {
            // 1) Build your map of sessionId → all checkins
            const bySession: Record<string, CheckinDto[]> = {};
            all.forEach(ci => {
                if (!ci.sessionId) return;
                (bySession[ci.sessionId] ||= []).push(ci);
            });
            this.sessionCheckins = bySession;

            // 2) Build the Set of sessionIds that *this user* has checked in to
            const newSet = new Set<string>();
            const me = this.currentUserId;
            for (const [sid, arr] of Object.entries(bySession)) {
                if (arr.some(ci => ci.userId === me)) {
                    newSet.add(sid);
                }
            }
            // Only log once if it actually changed:
            if (!areSetsEqual(newSet, this.checkedInSessionIds)) {
                console.log('[ConferenceDetails] checkedInSessionIds changed →', Array.from(newSet));
                this.checkedInSessionIds = newSet;
            }

            this.cdr.markForCheck();
        });
    }

    onCheckIn(session: SessionDetailsDto) {
        this.checkinStream.sendCheckin(session.sessionId, this.conferenceId);
    }

    onCheckOut(session: SessionDetailsDto) {
        this.checkinStream.sendCheckout(session.sessionId, this.conferenceId);
    }

    openSessionImportDialog(): void {
        const dialogRef = this.dialog.open(SessionImportDialogComponent, {
            width: '1000px',
            maxWidth: '90vw',
            data: {conferenceId: this.conferenceId},
            autoFocus: true,
            restoreFocus: true
        });
    }
}

function areSetsEqual(a: Set<string>, b: Set<string>): boolean {
    if (a.size !== b.size) return false;
    for (const x of a) if (!b.has(x)) return false;
    return true;
}
