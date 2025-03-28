import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-conference-overview',
    imports: [
        RouterLink,
        MatButtonModule
    ],
  templateUrl: './conference-overview.component.html',
  styleUrl: './conference-overview.component.scss'
})
export class ConferenceOverviewComponent {

}
