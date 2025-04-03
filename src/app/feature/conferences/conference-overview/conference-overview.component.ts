import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { ConferenceService } from '../../../core/services/conference/conference.service';
import { Conference } from '../../../core/models/conference/conference.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-conference-overview',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './conference-overview.component.html',
  styleUrl: './conference-overview.component.scss'
})
export class ConferenceOverviewComponent implements OnInit {
  private conferenceService = inject(ConferenceService);
  
  conferences: Conference[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.conferenceService.getConferences().subscribe({
      next: (data) => {
        this.conferences = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading conferences:', err);
        this.error = 'Failed to load conferences';
        this.loading = false;
      }
    });
  }
}
