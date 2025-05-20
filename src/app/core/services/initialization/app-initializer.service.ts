import {inject, Injectable} from '@angular/core';
import {UserService} from '../user/user.service';
import {AuthService} from '../auth/auth.service';
import Keycloak from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class AppInitializerService {
    private keycloak = inject(Keycloak);

    /**
     * Waits for Keycloak to be properly initialized with a timeout
     * @param maxAttempts Maximum number of attempts to check
     * @param delayMs Delay between attempts in milliseconds
     */
    private async waitForKeycloakInit(maxAttempts = 1, delayMs = 300): Promise<boolean> {
        let attempts = 0;

        while (attempts < maxAttempts) {
            console.log(`Waiting for Keycloak to initialize... Attempt ${attempts + 1}/${maxAttempts}`);

            if (this.keycloak.token) {
                console.log('Keycloak token is available now');
                return true;
            }

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
            await this.waitForKeycloakInit();
            console.log(`Keycloak authentication state: ${this.keycloak.authenticated}`);
            return true;
        } catch (error) {
            console.error('Error in app initialization:', error);
            return true;
        }
    }
}
