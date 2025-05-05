import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import Keycloak, {KeycloakTokenParsed} from 'keycloak-js';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-public-layout',
    imports: [
        CommonModule,
        MatToolbar,
        RouterOutlet,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    templateUrl: './public-layout.component.html',
    styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly router: Router = inject(Router);

    public readonly tokenParsed: KeycloakTokenParsed | undefined = this.keycloak.tokenParsed;
    public features = [
        { icon: 'event',       title: 'Session Scheduling',   description: 'Browse and organize sessions ahead of time.' },
        { icon: 'person_add',  title: 'Easy Check-in/Out',    description: 'Quickly check in and out of sessions with a single click.' },
        { icon: 'people',      title: 'Live Attendance',      description: 'See who is attending in real time.' },
        { icon: 'bar_chart',   title: 'Analytics & Reports',  description: 'Export attendance data and gain insights for your event.' }
    ];

    login() {
        this.keycloak.login().then(r => console.log(r));
    }

    register() {
        this.keycloak.register().then(r => console.log(r));
    }

    logout() {
        this.keycloak.logout().then(r => console.log(r));
    }

    toPlatform() {
        this.router.navigate(['/platform/conferences']);
    }

    ngOnInit() {
        if (this.keycloak.authenticated) {
            console.log(this.tokenParsed);
        }
    }
}
