import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ImportSessionsRequest, SessionImportStrategyDto} from '../../models/session/session-import-strategy.model';
import {SessionDetailsDto, SessionPreviewDto} from '../../models/session/session.model';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private http = inject(HttpClient);
    private sessionEndpoint = `${environment.BASE_API_URL}/api/schedule/sessions`;
    private conferenceEndpoint = `${environment.BASE_API_URL}/api/schedule/conferences`;
    private strategyEndpoint = `${environment.BASE_API_URL}/api/schedule/session/import`;

    // Get all available import strategies
    getImportStrategies(): Observable<SessionImportStrategyDto[]> {
        return this.http.get<SessionImportStrategyDto[]>(this.strategyEndpoint)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get adapter-specific import strategies
    getAdapterStrategies(): Observable<SessionImportStrategyDto[]> {
        return this.http.get<SessionImportStrategyDto[]>(`${this.strategyEndpoint}/adapters`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Prepare sessions for import (fetches data but doesn't save it)
    prepareSessionImport(conferenceId: string, request: ImportSessionsRequest): Observable<SessionPreviewDto[]> {
        return this.http.post<SessionPreviewDto[]>(
            `${this.conferenceEndpoint}/${conferenceId}/prepare-sessions`,
            request
        ).pipe(
            catchError(this.handleError)
        );
    }

    // Create sessions from prepared data
    createSessions(conferenceId: string, sessions: SessionPreviewDto[]): Observable<void> {
        return this.http.post<void>(
            `${this.conferenceEndpoint}/${conferenceId}/create-sessions`,
            sessions
        ).pipe(
            catchError(this.handleError)
        );
    }

    // Get all sessions for a conference
    getSessionsByConferenceId(conferenceId: string): Observable<SessionDetailsDto[]> {
        return this.http.get<SessionDetailsDto[]>(`${this.sessionEndpoint}/conference/${conferenceId}`);
    }

    // Get a specific session by ID
    getSessionById(sessionId: string): Observable<SessionDetailsDto> {
        return this.http.get<SessionDetailsDto>(`${this.sessionEndpoint}/${sessionId}`);
    }

    // Get all sessions
    getAllSessions(): Observable<SessionDetailsDto[]> {
        return this.http.get<SessionDetailsDto[]>(this.sessionEndpoint);
    }

    // Handle API errors
    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);

        let errorMessage = 'Unknown error occurred';
        if (error.status === 404) {
            errorMessage = 'API endpoint not found. Please check server configuration.';
        } else if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        return throwError(() => new Error(errorMessage));
    }
}
