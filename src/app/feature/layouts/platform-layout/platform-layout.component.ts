import {Component, inject, OnInit} from '@angular/core';
import {MatDrawerMode, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatLine} from '@angular/material/core';
import {NgIf} from '@angular/common';
import Keycloak, {KeycloakLogoutOptions, KeycloakTokenParsed} from 'keycloak-js';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-platform-layout',
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatToolbar,
        MatIconModule,
        RouterOutlet,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        MatNavList,
        MatListItem,
        RouterLinkActive,
        MatLine,
        NgIf,
    ],
    templateUrl: './platform-layout.component.html',
    styleUrl: './platform-layout.component.scss'
})
export class PlatformLayoutComponent implements OnInit {
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly router: Router = inject(Router);
    private keycloakLogoutOptions: KeycloakLogoutOptions = {
        redirectUri: environment.keycloak.postLogoutRedirectUri
    }

    public readonly tokenParsed: KeycloakTokenParsed | undefined = this.keycloak.tokenParsed;
    public mode: FormControl<"over" | "push" | "side" | null> = new FormControl('push' as MatDrawerMode);

    toProfile() {
        this.router.navigate(['platform', 'profile']);
    }

    logout() {
        this.keycloak.logout(this.keycloakLogoutOptions)
    }

    ngOnInit(): void {
        //log the token but not parsed
        console.log("token", this.keycloak.token);
    }
}
