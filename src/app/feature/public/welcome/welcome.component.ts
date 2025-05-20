import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-welcome',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
    ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
    public features = [
        { id: 1,icon: 'event', title: 'Conference Scheduling',description: 'Easily import and schedule conferences.' },
        { id: 2,icon: 'person_add',  title: 'Easy Check-in/Out', description: 'Quickly check in and out of sessions with a single click.' },
        { id: 3,icon: 'people', title: 'Live Attendance', description: 'See who is attending which sessions in real time.' },
        { id: 4,icon: 'bar_chart', title: 'Attendance distribution', description: 'Get insights about attendance distribution.' },
    ];
}
