import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import {TimeGroup, TimeGroupComponent} from '../time-group/time-group.component';
import {SessionDetailsDto} from '../../../../core/models/session/session.model';

@Component({
    standalone: true,
    selector: 'app-sessions-tabs',
    imports: [CommonModule, MatTabsModule, TimeGroupComponent],
    templateUrl: './session-tabs.component.html',
    styleUrls: ['./session-tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsTabsComponent {
    @Input() dates: Date[] = [];
    @Input() groupedSessions: Record<string, TimeGroup[]> = {};
    @Output() checkIn: EventEmitter<SessionDetailsDto> = new EventEmitter<SessionDetailsDto>();
}
