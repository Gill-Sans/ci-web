import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

// Interface for a check-in entry
export interface CheckinEntry {
  userId: string;
  firstName: string;
  lastName: string;
  sessionId: string;
}

// A minimal session interface based on component usage
export interface SessionInfo {
  id?: string;
  sessionId?: string;
  title: string;
  description?: string;
  speaker?: string;
  locationDetails?: string;
  startTime: string | Date;
  endTime: string | Date;
  conferenceId?: string;
  checkinCount?: number;
}

@Component({
  standalone: true,
  selector: 'app-session-card',
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss']
})
export class SessionCardComponent {
  @Input() session!: SessionInfo;
  @Input() checkins: CheckinEntry[] = [];
  @Input() isCheckedIn: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() hasTimeConflict: boolean = false;
  @Input() buttonTooltip: string = '';
  @Input() hasTempId: boolean = false;
  @Input() debugMode: boolean = false;
  
  @Output() checkIn = new EventEmitter<SessionInfo>();
  
  get sessionId(): string {
    // Similar to getSessionId in parent component
    if (this.session.id) {
      return this.session.id;
    }
    if (this.session.sessionId) {
      return this.session.sessionId;
    }
    return '';
  }
}
