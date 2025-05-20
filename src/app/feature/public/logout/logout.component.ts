import { Component } from '@angular/core';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-logout',
    imports: [
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        RouterLink
    ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

}
