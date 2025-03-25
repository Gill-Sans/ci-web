import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private readonly http: HttpClient = inject(HttpClient);

  checkIn(sessionId: string) {
    return this.http.post(
        environment.BASE_API_URL + '/api/interaction/check-ins',
        {
          "userId": '4e1443ea-e633-43c6-8cbb-9ac83b27a6d3',
          "sessionId": sessionId
        },
        { responseType: 'text' }
    );
  }
}
