import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SessionDetailsDto } from '../../../../core/models/session/session.model';
import { CheckinDto } from '../../../../core/models/checkin/checkin.model';
import { TimeGroupComponent } from '../time-group/time-group.component';
import {TimeGroup} from '../../../../core/utils/session-organizer';

@Component({
    standalone: true,
    selector: 'app-sessions-tabs',
    imports: [
        CommonModule,
        MatTabsModule,
        TimeGroupComponent,
    ],
    templateUrl: './session-tabs.component.html',
    styleUrls: ['./session-tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsTabsComponent {
    @Input() dates: Date[] = [];
    @Input() groupedSessions: Record<string, TimeGroup[]> = {};
    @Input() sessionCheckins: Record<string, CheckinDto[]> = {};
    @Input() checkedInSessionIds = new Set<string>();
    @Output() checkIn = new EventEmitter<SessionDetailsDto>();

    isCheckedInSession(sessionId?: string): boolean {
        return !!sessionId && this.checkedInSessionIds.has(sessionId);
    }
}
