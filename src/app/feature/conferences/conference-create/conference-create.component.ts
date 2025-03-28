import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatDatepickerModule }  from '@angular/material/datepicker';
import { MatNativeDateModule }  from '@angular/material/core';
import { MatStepperModule }     from '@angular/material/stepper';

@Component({
    selector: 'app-conference-create',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule
    ],
    templateUrl: './conference-create.component.html',
    styleUrls: ['./conference-create.component.scss']
})
export class ConferenceCreateComponent {
    conferenceForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.conferenceForm = this.fb.group({
            // Step 1: Conference Details
            step1: this.fb.group({
                name: ['', Validators.required],
                description: ['', Validators.required]
            }),
            // Step 2: Speaker & Location
            step2: this.fb.group({
                speaker: ['', Validators.required],
                location: this.fb.group({
                    country: ['', Validators.required],
                    street: ['', Validators.required],
                    number: ['', Validators.required],
                    zip: ['', Validators.required],
                    state: ['', Validators.required],
                    locationDetails: ['']
                })
            }),
            // Step 3: Dates & Checkin Count
            step3: this.fb.group({
                startTime: [null, Validators.required],
                endTime: [null, Validators.required],
                checkinCount: [0, Validators.required]
            })
        });
    }

    // Getters for the nested form groups
    get step1FormGroup(): FormGroup {
        return this.conferenceForm.get('step1') as FormGroup;
    }

    get step2FormGroup(): FormGroup {
        return this.conferenceForm.get('step2') as FormGroup;
    }

    get step3FormGroup(): FormGroup {
        return this.conferenceForm.get('step3') as FormGroup;
    }

    onSubmit() {
        if (this.conferenceForm.valid) {
            const step1 = this.step1FormGroup.value;
            const step2 = this.step2FormGroup.value;
            const step3 = this.step3FormGroup.value;
            const conferenceData = {
                ...step1,
                ...step2,
                ...step3
            };
            console.log('Conference data:', conferenceData);
            // TODO: Dispatch command or service call to create the conference.
        }
    }
}
