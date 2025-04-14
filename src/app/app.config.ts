import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    includeBearerTokenInterceptor,
    provideKeycloak
} from 'keycloak-angular';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideNativeDateAdapter} from '@angular/material/core';
import {AppInitializerService} from './core/services/initialization/app-initializer.service';
import {environment} from '../environments/environment';

// Function for the app initialization that uses inject() in the correct context
function initializeApp() {
  const appInitializerService = inject(AppInitializerService);
  return appInitializerService.initializeUserProfile();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideKeycloak({
            config: {
                url: 'http://localhost:8180',
                realm: 'capit',
                clientId: 'angular-client'
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
                checkLoginIframe: false, // This can improve initialization reliability
                enableLogging: true // Enable logging for debugging
            }
        }),
        // Other providers
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimations(),
        provideNativeDateAdapter(),
        provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
        {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [
                {
                    // Make sure pattern matches the BASE_API_URL from environment
                    urlPattern: new RegExp(`^${environment.BASE_API_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/.*$`),
                    httpMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
                }
            ]
        },
        provideAppInitializer(initializeApp)
    ]
};
