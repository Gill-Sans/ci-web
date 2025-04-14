import {inject, Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly keycloak: Keycloak = inject(Keycloak);

    isAuthenticated(): boolean | undefined {
        try {
            console.log('Checking authentication state... isAuthenticated');
            return this.keycloak.authenticated;
        } catch (error) {
            console.error('Error checking authentication state', error);
            return false;
        }
    }

    async checkAuthenticated(): Promise<boolean | undefined> {
        try {
            console.log(`Checking authentication state: authenticated=${this.keycloak.authenticated}, token available=${!!this.keycloak.tokenParsed}`);
            return this.keycloak.authenticated;
        } catch (error) {
            console.error('Error checking authentication state', error);
            return false;
        }
    }
}
