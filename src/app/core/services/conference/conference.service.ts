// core/services/conference/conference.service.ts
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateConferenceDto} from '../../models/conference/conferenceCreateDto.model';
import {Conference} from '../../models/conference/conference.model';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConferenceService {
    private http: HttpClient = inject(HttpClient);
    private conferenceEndpoint = `${environment.BASE_API_URL}/api/schedule/conferences`;

    createConference(dto: CreateConferenceDto): Observable<Conference> {
        return this.http.post<Conference>(this.conferenceEndpoint, dto);
    }

    getConferences(): Observable<Conference[]> {
        return this.http.get<Conference[]>(this.conferenceEndpoint);
    }

    getConference(id: string): Observable<Conference> {
        return this.http.get<Conference>(`${(this.conferenceEndpoint)}/${id}`);
    }

    updateConference(id: string, dto: Partial<CreateConferenceDto>): Observable<Conference> {
        return this.http.put<Conference>(`${this.conferenceEndpoint}/${id}`, dto);
    }

    deleteConference(id: string): Observable<void> {
        return this.http.delete<void>(`${this.conferenceEndpoint}/${id}`);
    }
}
