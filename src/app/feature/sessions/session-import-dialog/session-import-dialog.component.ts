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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../../../core/services/session/session.service';
import { ImportSessionsRequest, SessionImportStrategyDto, SessionImportStrategyType } from '../../../core/models/session/session-import-strategy.model';
import { SessionPreviewDto } from '../../../core/models/session/session.model';
import { finalize } from 'rxjs';

export interface SessionImportDialogData {
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
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './session-import-dialog.component.html',
  styleUrl: './session-import-dialog.component.scss'
})
export class SessionImportDialogComponent implements OnInit {
  private sessionService = inject(SessionService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<SessionImportDialogComponent>);
  
  conferenceId: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: SessionImportDialogData) {
    this.conferenceId = data.conferenceId;
  }
  
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
      strategyName: [''],
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
      
      // Update validators based on strategy type
      if (value === SessionImportStrategyType.ADAPTER) {
        this.strategyForm.get('strategyName')?.setValidators([Validators.required]);
      } else {
        this.strategyForm.get('strategyName')?.clearValidators();
      }
      this.strategyForm.get('strategyName')?.updateValueAndValidity();
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
          this.snackBar.open(
            `Failed to load import strategies: ${error.message}`, 
            'Close', 
            { duration: 5000 }
          );
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
    
    this.sessionService.prepareSessionImport(this.conferenceId, request)
      .pipe(finalize(() => this.loadingSessions = false))
      .subscribe({
        next: (data) => {
          this.sessions = data;
          if (this.sessions.length === 0) {
            this.snackBar.open('No sessions found with the provided configuration', 'Close', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error preparing session import:', error);
          this.snackBar.open(
            `Failed to prepare session import: ${error.message}`, 
            'Close', 
            { duration: 5000 }
          );
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
    
    this.sessionService.createSessions(this.conferenceId, this.sessions)
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

  // Format strategy type for display
  formatStrategyType(type: string): string {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
} 