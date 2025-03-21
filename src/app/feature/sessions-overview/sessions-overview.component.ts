import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ButtonComponent} from '../../shared/button/button.component';
import {CheckinService} from '../../core/services/checkin.service';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-sessions-overview',
  imports: [
    ButtonComponent
  ],
  templateUrl: './sessions-overview.component.html',
  styleUrl: './sessions-overview.component.scss'
})
export class SessionsOverviewComponent implements OnInit, OnDestroy {
  private readonly checkinService: CheckinService = inject(CheckinService);

    session1Id = 'd3b2bfc3-18aa-40f2-8c39-cb0e33ca2cc7';
    session2Id = 'a1b2c3d4-5678-90ab-cdef-1234567890ab';

    sessionCounts: {[sessionId: string]: number} = {};
    subscriptions: Subscription[] = [];

    ngOnInit(): void {
        const source = new EventSource(environment.interactionsServiceApiUrl + '/checkins/stream');
        source.addEventListener('checkin', (event: any) => {
            const data = JSON.parse(event.data);
            console.log('Received SSE event for session', data.sessionId, 'with new count =', data.count);
            this.sessionCounts[data.sessionId] = data.count;
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    checkIn(sessionId: string) {
        this.subscriptions.push(
            this.checkinService.checkIn(sessionId).subscribe(() => {
                console.log('Checked in for session', sessionId);
            })
        );
    }
}
