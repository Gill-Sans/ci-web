import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImportSessionsRequest, SessionImportStrategyDto } from '../../models/session/session-import-strategy.model';
import { SessionDetailsDto, SessionPreviewDto } from '../../models/session/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private http = inject(HttpClient);
  private sessionEndpoint = `${environment.BASE_API_URL}/api/schedule/sessions`;
  private conferenceEndpoint = `${environment.BASE_API_URL}/api/schedule/conferences`;
  private strategyEndpoint = `${environment.BASE_API_URL}/api/session/import`;

  // Get all available import strategies
  getImportStrategies(): Observable<SessionImportStrategyDto[]> {
    return this.http.get<SessionImportStrategyDto[]>(this.strategyEndpoint);
  }

  // Get adapter-specific import strategies
  getAdapterStrategies(): Observable<SessionImportStrategyDto[]> {
    return this.http.get<SessionImportStrategyDto[]>(`${this.strategyEndpoint}/adapters`);
  }

  // Prepare sessions for import (fetches data but doesn't save it)
  prepareSessionImport(conferenceId: string, request: ImportSessionsRequest): Observable<SessionPreviewDto[]> {
    return this.http.post<SessionPreviewDto[]>(
      `${this.conferenceEndpoint}/${conferenceId}/prepare-sessions`, 
      request
    );
  }

  // Create sessions from prepared data
  createSessions(conferenceId: string, sessions: SessionPreviewDto[]): Observable<void> {
    return this.http.post<void>(
      `${this.conferenceEndpoint}/${conferenceId}/create-sessions`, 
      sessions
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
} 