import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
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
    ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {
    private readonly keycloak: Keycloak = inject(Keycloak);
    private readonly router: Router = inject(Router);

    public readonly tokenParsed: KeycloakTokenParsed | undefined = this.keycloak.tokenParsed;

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
