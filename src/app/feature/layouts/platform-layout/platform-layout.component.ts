import {Component, inject} from '@angular/core';
import {MatDrawerMode, MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatLine} from '@angular/material/core';
import {NgIf} from '@angular/common';
import Keycloak, {KeycloakTokenParsed} from 'keycloak-js';

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
export class PlatformLayoutComponent {
    private readonly keycloak: Keycloak = inject(Keycloak);

    public readonly tokenParsed: KeycloakTokenParsed | undefined = this.keycloak.tokenParsed;
    public mode: FormControl<"over" | "push" | "side" | null> = new FormControl('push' as MatDrawerMode);

    logout() {
        this.keycloak.logout().then(r => console.log(r));
    }
}
