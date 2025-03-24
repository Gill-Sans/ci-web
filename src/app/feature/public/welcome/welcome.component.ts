import {Component, inject} from '@angular/core';
import Keycloak from 'keycloak-js';
import {Router} from '@angular/router';
import {routes} from '../../../app.routes';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly router: Router = inject(Router);

    login() {
        this.keycloak.login().then(r => console.log(r));
    }

    logout() {
        this.keycloak.logout().then(r => console.log(r));
    }

    toSessions() {
        this.router.navigate(['/sessions']);
    }
}
