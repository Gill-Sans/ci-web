import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConferenceService } from '../../../core/services/conference/conference.service';
import { SessionService } from '../../../core/services/session/session.service';
import { Conference } from '../../../core/models/conference/conference.model';
import { SessionDetailsDto } from '../../../core/models/session/session.model';
import { DatePipe } from '@angular/common';
import { SessionImportDialogComponent } from '../../sessions/session-import-dialog/session-import-dialog.component';

@Component({
  selector: 'app-conference-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    DatePipe
  ],
  providers: [DatePipe],
  templateUrl: './conference-details.component.html',
  styleUrl: './conference-details.component.scss'
})
export class ConferenceDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private conferenceService = inject(ConferenceService);
  private sessionService = inject(SessionService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private datePipe = inject(DatePipe);
  
  conferenceId: string = '';
  conference: Conference | null = null;
  sessions: SessionDetailsDto[] = [];
  sessionDates: Date[] = [];
  
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.conferenceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadConference();
  }

  loadConference(): void {
    if (!this.conferenceId) {
      this.error = 'No conference ID provided';
      this.loading = false;
      return;
    }

    this.conferenceService.getConference(this.conferenceId).subscribe({
      next: (data) => {
        this.conference = data;
        this.loading = false;
        this.loadSessions();
      },
      error: (err) => {
        console.error('Error loading conference:', err);
        this.error = 'Failed to load conference details';
        this.loading = false;
      }
    });
  }
  
  loadSessions(): void {
    if (!this.conferenceId) return;
    
    this.sessionService.getSessionsByConferenceId(this.conferenceId).subscribe({
      next: (data) => {
        console.log('Loaded sessions:', data);
        this.sessions = data;
        this.organizeSessionsByDate();
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
      }
    });
  }
  
  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'EEE, MMM d, y') || '';
  }
  
  organizeSessionsByDate(): void {
    // Reset data structures
    this.sessionDates = [];
    
    if (!this.sessions.length) return;
    
    // Extract unique dates from sessions
    const dateSet = new Set<string>();
    this.sessions.forEach(session => {
      const date = new Date(session.startTime).toDateString();
      dateSet.add(date);
    });
    
    // Sort dates
    this.sessionDates = Array.from(dateSet).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  }
  
  // Filter sessions by date
  getSessionsByDate(date: Date): SessionDetailsDto[] {
    return this.sessions.filter(s => 
      new Date(s.startTime).toDateString() === date.toDateString()
    );
  }
  
  // Group sessions by start time - array approach
  getSessionsByStartTime(date: Date): {time: string, sessions: SessionDetailsDto[]}[] {
    const dateSessions = this.getSessionsByDate(date);
    
    // First, sort all sessions by start time
    const sortedSessions = [...dateSessions].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
    
    // Group sessions by time string
    const timeGroups = new Map<string, {time: string, timestamp: number, sessions: SessionDetailsDto[]}>();
    
    sortedSessions.forEach(session => {
      const startTime = new Date(session.startTime);
      const timeString = this.datePipe.transform(startTime, 'shortTime') || '';
      
      if (!timeGroups.has(timeString)) {
        timeGroups.set(timeString, {
          time: timeString,
          timestamp: startTime.getTime(),
          sessions: []
        });
      }
      
      timeGroups.get(timeString)?.sessions.push(session);
    });
    
    // Convert to array and sort by actual timestamp
    const result = Array.from(timeGroups.values())
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return result;
  }
  
  openSessionImportDialog(): void {
    const dialogRef = this.dialog.open(SessionImportDialogComponent, {
      width: '800px',
      data: { conferenceId: this.conferenceId }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loadSessions();
        this.snackBar.open('Sessions imported successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  checkInToSession(session: SessionDetailsDto): void {
    // Placeholder for check-in functionality
    console.log('Checking in to session:', session);
    this.snackBar.open(`Checked in to ${session.title}`, 'Close', {
      duration: 3000
    });
  }
}
