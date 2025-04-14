import {inject, Injectable} from '@angular/core';
import {UserService} from '../user/user.service';
import {firstValueFrom, of, timeout, catchError} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import Keycloak from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class AppInitializerService {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private keycloak = inject(Keycloak);

    /**
     * Waits for Keycloak to be properly initialized with a timeout
     * @param maxAttempts Maximum number of attempts to check
     * @param delayMs Delay between attempts in milliseconds
     */
    private async waitForKeycloakInit(maxAttempts = 5, delayMs = 300): Promise<boolean> {
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            console.log(`Waiting for Keycloak to initialize... Attempt ${attempts + 1}/${maxAttempts}`);
            
            if (this.keycloak.token) {
                console.log('Keycloak token is available now');
                return true;
            }
            
            // Wait for a short period
            await new Promise(resolve => setTimeout(resolve, delayMs));
            attempts++;
        }
        
        console.warn('Keycloak initialization timed out');
        return false;
    }

    /**
     * Initializes the user profile if the user is authenticated
     * This can be used as an app initializer function
     */
    async initializeUserProfile(): Promise<boolean> {
        try {
            // Wait for Keycloak to be properly initialized
            await this.waitForKeycloakInit();
            
            // We don't need to check authentication - Keycloak and the auth guard handle this
            // Just logging authentication state for debugging
            console.log(`Keycloak authentication state: ${this.keycloak.authenticated}`);
            
            // Always return true to allow app initialization to continue
            // The auth guard will handle redirecting unauthenticated users
            return true;
        } catch (error) {
            console.error('Error in app initialization:', error);
            return true; // Continue app initialization regardless of errors
        }
    }
}
