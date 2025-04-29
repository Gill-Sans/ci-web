import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SessionDetailsDto} from '../../../../core/models/session/session.model';
import {SessionCardComponent} from '../../../../shared/components/session-card/session-card.component';
import {MatIcon} from '@angular/material/icon';


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
    @Output() checkIn = new EventEmitter<SessionDetailsDto>();
}
