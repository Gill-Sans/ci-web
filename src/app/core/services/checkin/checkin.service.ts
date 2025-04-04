import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CheckinDto} from '../../models/checkin/checkin.model';
import {Observable, of, tap, map} from 'rxjs';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly keycloak = inject(Keycloak);
  private readonly apiUrl = `${environment.BASE_API_URL}/api/interaction/check-ins`;

  private checkedInSessions = signal<string[]>([]);
  public checkedInSessions$ = this.checkedInSessions.asReadonly();
  private additionalCheckins = new Map<string, number>();

  checkIn(sessionId: string): Observable<CheckinDto> {
    if (!sessionId) {
      console.error('Cannot check in: Invalid session ID');
      return of({} as CheckinDto);
    }

    let userId = '';

    if (this.keycloak && this.keycloak.tokenParsed) {
      userId = this.keycloak.tokenParsed.sub || '';
    }

    if (!userId) {
      console.error('Cannot check in: No user ID available from Keycloak');
      return of({} as CheckinDto);
    }

    return this.http.post<CheckinDto>(
      this.apiUrl,
      {
        userId,
        sessionId
      }
    ).pipe(
      tap(response => {
        const currentSessions = this.checkedInSessions$();
        if (!currentSessions.includes(sessionId)) {
          this.checkedInSessions.update(sessions => [...sessions, sessionId]);
        }

        const currentCount = this.additionalCheckins.get(sessionId) || 0;
        this.additionalCheckins.set(sessionId, currentCount + 1);
      })
    );
  }

  isCheckedIn(sessionId: string): boolean {
    if (!sessionId) return false;
    return this.checkedInSessions$().includes(sessionId);
  }

  getTotalCheckinCount(sessionId: string): number {
    if (!sessionId) return 0;
    return this.additionalCheckins.get(sessionId) || 0;
  }
}
