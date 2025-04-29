import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, ChangeDetectorRef} from '@angular/core';
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
    conferenceId!: string;
    conference: Conference | null = null;
    sessions: SessionDetailsDto[] = [];
    sessionDates: Date[] = [];
    groupedByDate: Record<string, { time: string; sessions: SessionDetailsDto[] }[]> = {};
    loading= signal(true);
    error: string | null = null;
    checkinCounts: Record<string, number> = {};
    private checkinSub?: Subscription;
    private dialog: MatDialog = inject(MatDialog);


    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly conferenceService: ConferenceService = inject(ConferenceService);
    private readonly sessionService: SessionService = inject(SessionService);
    private readonly checkinStream: CheckinStreamService = inject(CheckinStreamService);
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly cdr = inject(ChangeDetectorRef);

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
        const dateSet = new Set<string>();
        this.sessions.forEach(s => {
            dateSet.add(new Date(s.startTime).toDateString());
        });

        this.sessionDates = [...dateSet]
            .map(ds => new Date(ds))
            .sort((a, b) => a.getTime() - b.getTime());

        const grouped: Record<string, { time: string; sessions: SessionDetailsDto[] }[]> = {};
        for (const day of this.sessionDates) {
            const key = day.toDateString();
            const daySessions = this.sessions
                .filter(s => new Date(s.startTime).toDateString() === key)
                .sort((a, b) =>
                    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                );

            const slots: { time: string; sessions: SessionDetailsDto[] }[] = [];
            for (const sess of daySessions) {
                const time = new Date(sess.startTime)
                    .toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

                let grp = slots.find(g => g.time === time);
                if (!grp) {
                    grp = { time, sessions: [] };
                    slots.push(grp);
                }
                grp.sessions.push(sess);
            }
            grouped[key] = slots;
        }

        this.groupedByDate = grouped;
        this.cdr.markForCheck();
    }


    private connectCheckinStream() {
        this.checkinStream.connect(this.conferenceId);
        this.checkinSub = this.checkinStream.entries$.subscribe(entries => {
            const counts: Record<string, number> = {};
            for (const e of entries) {
                counts[e.sessionId] = (counts[e.sessionId] || 0) + 1;
            }
            this.checkinCounts = counts;
        });
    }


    onCheckIn(session: SessionDetailsDto) {
        if (!this.keycloak.authenticated) {
            console.error('No user ID available, cannot check in');
            return;
        }

        const req: CreateCheckinRequest = {
            userId: this.keycloak.idTokenParsed?.sub || '',
            conferenceId: this.conferenceId,
            sessionId: session.id!
        };

        this.checkinStream.sendCheckin(req);
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
