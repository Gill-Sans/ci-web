import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../../../core/services/session/session.service';
import { ImportSessionsRequest, SessionImportStrategyDto, SessionImportStrategyType } from '../../../core/models/session/session-import-strategy.model';
import { SessionPreviewDto } from '../../../core/models/session/session.model';
import { finalize } from 'rxjs';

interface SessionImportDialogData {
  conferenceId: string;
}

@Component({
  selector: 'app-session-import-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './session-import-dialog.component.html',
  styleUrl: './session-import-dialog.component.scss'
})
export class SessionImportDialogComponent implements OnInit {
  private sessionService = inject(SessionService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<SessionImportDialogComponent>);
  
  @Inject(MAT_DIALOG_DATA) private data!: SessionImportDialogData;
  
  // Forms
  strategyForm!: FormGroup;
  
  // Data
  strategyTypes = Object.values(SessionImportStrategyType);
  strategies: SessionImportStrategyDto[] = [];
  selectedStrategyType: SessionImportStrategyType | null = null;
  filteredStrategies: SessionImportStrategyDto[] = [];
  
  // Sessions
  sessions: SessionPreviewDto[] = [];
  displayedColumns: string[] = ['title', 'speaker', 'startTime', 'endTime', 'locationDetails', 'actions'];
  
  // Loading states
  loadingStrategies = false;
  loadingSessions = false;
  creatingSession = false;
  
  ngOnInit(): void {
    this.createForms();
    this.loadStrategies();
  }
  
  createForms(): void {
    this.strategyForm = this.fb.group({
      strategyType: ['', Validators.required],
      strategyName: ['', Validators.required],
      url: ['', Validators.required],
      httpMethod: ['GET', Validators.required],
      additionalParams: this.fb.group({})
    });
    
    // Listen for strategy type changes
    this.strategyForm.get('strategyType')?.valueChanges.subscribe(value => {
      this.selectedStrategyType = value;
      this.filterStrategies();
      
      // Reset strategy name when type changes
      this.strategyForm.get('strategyName')?.setValue('');
    });
  }
  
  loadStrategies(): void {
    this.loadingStrategies = true;
    this.sessionService.getImportStrategies()
      .pipe(finalize(() => this.loadingStrategies = false))
      .subscribe({
        next: (data) => {
          this.strategies = data;
          this.filterStrategies();
        },
        error: (error) => {
          console.error('Error loading strategies:', error);
          this.snackBar.open('Failed to load import strategies', 'Close', {
            duration: 3000
          });
        }
      });
  }
  
  filterStrategies(): void {
    if (this.selectedStrategyType) {
      this.filteredStrategies = this.strategies.filter(s => s.strategy === this.selectedStrategyType);
    } else {
      this.filteredStrategies = this.strategies;
    }
  }
  
  prepareSessionImport(): void {
    if (this.strategyForm.invalid) return;
    
    const request: ImportSessionsRequest = this.strategyForm.value;
    this.loadingSessions = true;
    
    this.sessionService.prepareSessionImport(this.data.conferenceId, request)
      .pipe(finalize(() => this.loadingSessions = false))
      .subscribe({
        next: (data) => {
          this.sessions = data;
        },
        error: (error) => {
          console.error('Error preparing session import:', error);
          this.snackBar.open('Failed to prepare session import', 'Close', {
            duration: 3000
          });
        }
      });
  }
  
  removeSession(index: number): void {
    this.sessions.splice(index, 1);
  }
  
  createSessions(): void {
    if (this.sessions.length === 0) {
      this.snackBar.open('No sessions to import', 'Close', {
        duration: 3000
      });
      return;
    }
    
    this.creatingSession = true;
    
    this.sessionService.createSessions(this.data.conferenceId, this.sessions)
      .pipe(finalize(() => this.creatingSession = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Sessions imported successfully', 'Close', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating sessions:', error);
          this.snackBar.open('Failed to create sessions', 'Close', {
            duration: 3000
          });
        }
      });
  }
  
  cancel(): void {
    this.dialogRef.close();
  }
} 