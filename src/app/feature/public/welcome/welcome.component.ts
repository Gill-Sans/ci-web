import {Component, inject, OnInit} from '@angular/core';
import Keycloak, {KeycloakTokenParsed} from 'keycloak-js';
import {Router} from '@angular/router';
import {routes} from '../../../app.routes';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly router: Router = inject(Router);
    public readonly tokenParsed: KeycloakTokenParsed | undefined = this.keycloak.tokenParsed;

    login() {
        this.keycloak.login().then(r => console.log(r));
    }

    logout() {
        this.keycloak.logout().then(r => console.log(r));
    }

    toSessions() {
        this.router.navigate(['/sessions']);
    }

    ngOnInit() {
        if (this.keycloak.authenticated) {
            console.log(this.tokenParsed);
        }
    }
}
