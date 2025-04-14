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
    private apiUrl = `${environment.BASE_API_URL}/api/users`;
    private userProfile: UserProfile | null = null;

    getUserProfile(): Observable<UserProfile | null> {
        // Return cached profile if available
        if (this.userProfile) {
            return of(this.userProfile);
        }

        // Log the URL being requested for debugging
        const url = `${this.apiUrl}/details`;
        console.log(`Fetching user profile from: ${url}`);

        return this.http.get<UserProfile>(url)
            .pipe(
                tap(profile => {
                    console.log('Profile successfully loaded');
                    this.userProfile = profile;
                }),
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    console.error('Failed to load profile, this is expected if API is not running or user is not logged in');
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
