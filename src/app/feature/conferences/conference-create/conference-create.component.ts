import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatButtonModule }      from '@angular/material/button';
import { MatDatepickerModule }  from '@angular/material/datepicker';
import { MatNativeDateModule }  from '@angular/material/core';
import { MatStepperModule }     from '@angular/material/stepper';
import {CreateConferenceDto} from '../../../core/models/conference/conferenceCreateDto.model';
import {ConferenceService} from '../../../core/services/conference/conference.service';

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
    private readonly conferenceService: ConferenceService = inject(ConferenceService);

    conferenceForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.conferenceForm = this.fb.group({
            // Step 1: Conference Details
            step1: this.fb.group({
                name: ['', Validators.required],
                description: ['', Validators.required]
            }),
            // Step 2: Location
            step2: this.fb.group({
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
                // We'll store the date and time separately, then combine them on submit
                startDate: [null, Validators.required],
                startTime: ['', Validators.required],
                endDate: [null, Validators.required],
                endTime: ['', Validators.required],
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

            // Combine date and time fields into single ISO strings for startTime and endTime.
            const combinedStart = this.combineDateTime(step3.startDate, step3.startTime);
            const combinedEnd = this.combineDateTime(step3.endDate, step3.endTime);

            // Construct the DTO according to the CreateConferenceDto interface.
            const conferenceData: CreateConferenceDto = {
                name: step1.name,
                description: step1.description,
                location: step2.location,
                startTime: combinedStart,
                endTime: combinedEnd,
            };

            console.log('Conference data:', conferenceData);

            // Call the service to create the conference.
            this.conferenceService.createConference(conferenceData).subscribe({
                next: (response) => {
                    console.log('Conference created successfully', response);
                },
                error: (err) => {
                    console.error('Error creating conference', err);
                }
            });
        }
    }

    /**
     * Combines a Date object (from the datepicker) and a time string ("HH:mm")
     * into a single ISO string. The backend can parse this as a LocalDateTime.
     */
    private combineDateTime(dateObj: Date, timeStr: string): string {
        //TODO: If dateObj is invalid or timeStr is empty, handle gracefully
        if (!dateObj || !timeStr) {
            return '';
        }

        const [hours, minutes] = timeStr.split(':').map((val) => parseInt(val, 10));
        const combined = new Date(dateObj);
        combined.setHours(hours, minutes, 0, 0);
        return combined.toISOString();
    }
}
