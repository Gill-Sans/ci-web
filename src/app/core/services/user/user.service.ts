// core/services/user/user.service.ts
import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, of, shareReplay, tap} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {UserProfile} from '../../models/user/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.backend.url}/api/users`;
    private userProfile: UserProfile | null = null;

    getUserProfile(): Observable<UserProfile | null> {
        if (this.userProfile) {
            return of(this.userProfile);
        }

        const url = `${this.apiUrl}/details`;

        return this.http.get<UserProfile>(url)
            .pipe(
                tap(profile => {
                    this.userProfile = profile;
                }),
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return of(null);
                })
            );
    }

    updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile | null> {
        const url = `${this.apiUrl}/details`;

        return this.http.patch<UserProfile>(url, profile)
            .pipe(
                tap(updatedProfile => {
                    console.log('Profile successfully updated');
                    this.userProfile = updatedProfile;
                }),
                catchError((error: HttpErrorResponse) => {
                    console.error('Error updating profile');
                    return of(null);
                })
            );
    }

    /**
     * Clear cached profile
     */
    clearCachedProfile(): void {
        this.userProfile = null;
    }
}
