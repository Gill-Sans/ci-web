import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import Keycloak, {KeycloakLogoutOptions, KeycloakTokenParsed} from 'keycloak-js';
import {CommonModule} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-public-layout',
    imports: [
        CommonModule,
        MatToolbar,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        RouterOutlet
    ],
    templateUrl: './public-layout.component.html',
    styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly router: Router = inject(Router);

    public readonly tokenParsed: KeycloakTokenParsed | undefined = this.keycloak.tokenParsed;

    private keycloakLogoutOptions: KeycloakLogoutOptions = {
        redirectUri: environment.keycloak.postLogoutRedirectUri
    }

    login() {
        this.keycloak.login().then(r => console.log(r));
    }

    register() {
        this.keycloak.register().then(r => console.log(r));
    }

    logout() {
        this.keycloak.logout(this.keycloakLogoutOptions).then(r => console.log(r));
    }

    toPlatform() {
        this.router.navigate(['/platform/conferences']);
    }
}
