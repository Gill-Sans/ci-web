import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SessionDetailsDto} from '../../../../core/models/session/session.model';
import {SessionCardComponent} from '../../../../shared/components/session-card/session-card.component';
import {MatIcon} from '@angular/material/icon';
import { CheckinDto } from '../../../../core/models/checkin/checkin.model';


export interface TimeGroup {
    time: string;
    sessions: SessionDetailsDto[];
}

@Component({
    standalone: true,
    selector: 'app-time-group',
    imports: [
        CommonModule,
        SessionCardComponent,
        MatIcon
    ],
    templateUrl: './time-group.component.html',
    styleUrls: ['./time-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGroupComponent {
    @Input() time!: string;
    @Input() sessions: SessionDetailsDto[] = [];
    @Input() sessionCheckins: Record<string, CheckinDto[]> = {};
    @Input() checkedInSessionIds = new Set<string>();
    // Indicates if the current user has checked in to any session in this time slot
    get hasCheckedInInGroup(): boolean {
        return this.sessions.some(sess => this.checkedInSessionIds.has(sess.sessionId));
    }
    isCheckedInSession(sessionId?: string): boolean {
        return !!sessionId && this.checkedInSessionIds.has(sessionId);
    }
    @Output() checkIn = new EventEmitter<SessionDetailsDto>();
}
