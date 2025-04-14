import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ConferenceService} from '../../../core/services/conference/conference.service';
import {SessionService} from '../../../core/services/session/session.service';
import {CheckinService} from '../../../core/services/checkin/checkin.service';
import {Conference} from '../../../core/models/conference/conference.model';
import {SessionDetailsDto} from '../../../core/models/session/session.model';
import {SessionImportDialogComponent} from '../../sessions/session-import-dialog/session-import-dialog.component';
import {finalize} from 'rxjs';
import {environment} from '../../../../environments/environment';

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
        DatePipe,
        MatTooltipModule
    ],
    providers: [DatePipe],
    templateUrl: './conference-details.component.html',
    styleUrl: './conference-details.component.scss'
})
export class ConferenceDetailsComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private conferenceService = inject(ConferenceService);
    private sessionService = inject(SessionService);
    private checkinService = inject(CheckinService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private datePipe = inject(DatePipe);

    // Single event source for all check-in events
    private _eventSource: EventSource | null = null;

    conferenceId: string = '';
    conference: Conference | null = null;
    sessions: SessionDetailsDto[] = [];
    sessionDates: Date[] = [];

    loading: boolean = true;
    error: string | null = null;
    checkinInProgress: boolean = false;

    // Debug flag - set to false in production
    debugMode: boolean = false;

    ngOnInit(): void {
        this.conferenceId = this.route.snapshot.paramMap.get('id') || '';
        this.loadConference();
    }

    ngOnDestroy(): void {
        // Close the SSE connection when the component is destroyed
        this.cleanupSse();
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
                this.cleanupSse();
                this.sessions = data.map(session => {
                    const existingId = this.getSessionId(session);

                    // If no ID exists, generate a temporary one
                    if (!existingId) {
                        const tempId = `temp-${new Date(session.startTime).getTime()}-${session.title.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;

                        return {
                            ...session,
                            id: tempId  // Store in the id field for consistency
                        };
                    }

                    // If sessionId exists but id doesn't, copy sessionId to id for consistent access
                    if (session.sessionId && !session.id) {
                        return {
                            ...session,
                            id: session.sessionId  // Copy sessionId to id for consistency
                        };
                    }

                    return session;
                });

                this.organizeSessionsByDate();

                // Set up a single SSE connection for all check-in updates
                this.connectToSseForCheckins();
            },
            error: (err) => {
                console.error('Error loading sessions:', err);
            }
        });
    }

    /**
     * Connect to SSE for all check-in updates
     */
    connectToSseForCheckins(): void {
        // Connect to a single SSE endpoint for all check-in events
        const sseUrl = `${environment.BASE_API_URL}/api/interaction/check-ins/stream`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener('checkin', (event: any) => {
            try {
                const data = JSON.parse(event.data);
                const sessionId = data.sessionId;
                const count = data.count;

                // Find the correct session and update its count
                const session = this.findSessionById(sessionId);
                if (session) {
                    session.checkinCount = count;
                }
            } catch (error) {
                console.error('Error processing SSE event:', error);
            }
        });

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            eventSource.close();
        };

        // Store the event source for cleanup
        this._eventSource = eventSource;
    }

    /**
     * Clean up SSE connection
     */
    private cleanupSse(): void {
        if (this._eventSource) {
            this._eventSource.close();
            this._eventSource = null;
        }
    }

    /**
     * Find a session by its ID
     */
    findSessionById(sessionId: string): SessionDetailsDto | undefined {
        return this.sessions.find(session => {
            const id = this.getSessionId(session);
            return id === sessionId;
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
    getSessionsByStartTime(date: Date): { time: string, sessions: SessionDetailsDto[] }[] {
        const dateSessions = this.getSessionsByDate(date);

        // First, sort all sessions by start time
        const sortedSessions = [...dateSessions].sort((a, b) => {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });

        // Group sessions by time string
        const timeGroups = new Map<string, { time: string, timestamp: number, sessions: SessionDetailsDto[] }>();

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
        return Array.from(timeGroups.values())
            .sort((a, b) => a.timestamp - b.timestamp);
    }

    openSessionImportDialog(): void {
        const dialogRef = this.dialog.open(SessionImportDialogComponent, {
            width: '1000px',
            maxWidth: '90vw',
            data: {conferenceId: this.conferenceId},
            autoFocus: true,
            restoreFocus: true
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
        const sessionId = this.getSessionId(session);
        if (!sessionId) {
            this.snackBar.open('Cannot check in: Session has no ID', 'Close', {
                duration: 3000,
                panelClass: 'error-snackbar'
            });
            return;
        }

        // Check if already in progress or checked in
        if (this.checkinInProgress || this.isCheckedIn(sessionId)) return;

        this.checkinInProgress = true;

        this.checkinService.checkIn(sessionId)
            .pipe(finalize(() => this.checkinInProgress = false))
            .subscribe({
                next: () => {
                    this.snackBar.open(`Checked in to ${session.title}`, 'Close', {
                        duration: 3000
                    });
                },
                error: (err) => {
                    console.error('Error checking in:', err);
                    this.snackBar.open('Failed to check in to session', 'Close', {
                        duration: 3000,
                        panelClass: 'error-snackbar'
                    });
                }
            });
    }

    isCheckedIn(sessionId: string): boolean {
        return this.checkinService.isCheckedIn(sessionId);
    }

    getCheckinCount(session: SessionDetailsDto): number {
        const sessionId = this.getSessionId(session);
        if (!sessionId) return 0;

        // Start with the backend count (or 0 if not available)
        const backendCount = session.checkinCount || 0;

        // Add any local check-ins that might not yet be reflected in the backend
        if (this.isCheckedIn(sessionId)) {
            // If we already have a backend count and the user is checked in,
            // then the backend count might already include this user's check-in
            // So we only need to add the local check-in if it's not from the current session
            return backendCount + (this.checkinService.getTotalCheckinCount(sessionId) - backendCount);
        }

        return backendCount;
    }

    /**
     * Check if this session conflicts with another session the user is checked into
     */
    hasTimeConflict(session: SessionDetailsDto): boolean {
        const sessionId = this.getSessionId(session);
        if (!sessionId || this.isCheckedIn(sessionId)) return false;

        const sessionTime = new Date(session.startTime).getTime();
        const checkedInSessions = this.checkinService.checkedInSessions$();

        if (checkedInSessions.length === 0) return false;

        return this.sessions.some(s => {
            const otherId = this.getSessionId(s);
            if (!otherId || otherId === sessionId) return false;

            const otherTime = new Date(s.startTime).getTime();
            return otherTime === sessionTime && this.isCheckedIn(otherId);
        });
    }

    /**
     * Get button color based on check-in status
     */
    getButtonColor(session: SessionDetailsDto): string {
        const sessionId = this.getSessionId(session);
        return sessionId && this.isCheckedIn(sessionId) ? 'primary' : 'accent';
    }

    /**
     * Get button icon based on check-in status
     */
    getButtonIcon(session: SessionDetailsDto): string {
        const sessionId = this.getSessionId(session);
        return sessionId && this.isCheckedIn(sessionId) ? 'how_to_reg' : 'person_add';
    }

    /**
     * Get button text based on check-in status
     */
    getButtonText(session: SessionDetailsDto): string {
        const sessionId = this.getSessionId(session);
        return sessionId && this.isCheckedIn(sessionId) ? 'Checked In' : 'Check In';
    }

    /**
     * Check if button should be disabled
     */
    isButtonDisabled(session: SessionDetailsDto): boolean {
        const sessionId = this.getSessionId(session);
        if (!sessionId) return true;

        // Don't disable if already checked in
        if (this.isCheckedIn(sessionId)) return false;

        // Disable if there's a time conflict
        return this.hasTimeConflict(session);
    }

    /**
     * Checks if the session has a temporary ID
     */
    hasTempId(session: SessionDetailsDto): boolean {
        const sessionId = this.getSessionId(session);
        return !!sessionId && sessionId.startsWith('temp-');
    }

    /**
     * Get a tooltip message for the button based on its state
     */
    getButtonTooltip(session: SessionDetailsDto): string {
        const sessionId = this.getSessionId(session);

        if (!sessionId) {
            return 'Cannot check in - session has no ID';
        }

        if (this.hasTempId(session)) {
            return 'This session has a temporary ID (client-side only)';
        }

        if (this.isCheckedIn(sessionId)) {
            return 'You are checked in to this session';
        }

        if (this.hasTimeConflict(session)) {
            return 'You are already checked in to another session at this time';
        }

        return 'Check in to this session';
    }

    /**
     * Get the effective ID for a session, which could be either id, sessionId, or a generated temporary ID
     */
    getSessionId(session: SessionDetailsDto): string {
        // Use existing id if available
        if (session.id) {
            return session.id;
        }

        // Use sessionId if available (from database)
        if (session.sessionId) {
            return session.sessionId;
        }

        // Return empty string if no ID exists
        return '';
    }

    /**
     * Checks if the session has a valid ID (either id or sessionId)
     */
    hasValidId(session: SessionDetailsDto): boolean {
        return !!session.id || !!session.sessionId;
    }
}
