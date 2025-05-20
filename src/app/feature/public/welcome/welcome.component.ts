import { Component } from '@angular/core';
import {MatCard, MatCardModule} from "@angular/material/card";
import {CommonModule, NgForOf} from "@angular/common";
import {MatIcon, MatIconModule} from '@angular/material/icon';

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
        { id: 1,icon: 'event', title: 'Session Scheduling',description: 'Browse and organize sessions ahead of time.' },
        { id: 2,icon: 'person_add',  title: 'Easy Check-in/Out', description: 'Quickly check in and out of sessions with a single click.' },
        { id: 3,icon: 'people', title: 'Live Attendance', description: 'See who is attending in real time.' },
        { id: 4,icon: 'bar_chart', title: 'Analytics & Reports', description: 'Export attendance data and gain insights for your event.' }
    ];
}
