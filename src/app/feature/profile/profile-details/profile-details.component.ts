import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user/user.service';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {finalize} from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {UserProfile} from '../../../core/models/user/user-profile.model';

@Component({
    selector: 'app-profile-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './profile-details.component.html',
    styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent implements OnInit {
    profile: UserProfile | null = null;
    profileForm: FormGroup;
    isLoading = true;
    isSubmitting = false;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            companyBranch: ['']
        });
    }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        this.isLoading = true;
        this.userService.getUserProfile()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(
                profile => {
                    if (profile) {
                        this.profile = profile;
                        this.profileForm.patchValue({
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                            email: profile.email,
                            companyBranch: profile.companyBranch || ''
                        });
                    }
                }
            );
    }

    saveProfile(): void {
        if (this.profileForm.invalid) {
            return;
        }

        this.isSubmitting = true;
        this.userService.updateUserProfile(this.profileForm.value)
            .pipe(finalize(() => this.isSubmitting = false))
            .subscribe(
                profile => {
                    if (profile) {
                        this.profile = profile;
                        this.snackBar.open('Profile updated successfully', 'Close', {
                            duration: 3000
                        });
                    } else {
                        this.snackBar.open('Failed to update profile', 'Close', {
                            duration: 3000
                        });
                    }
                }
            );
    }
}
