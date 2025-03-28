export interface CreateConferenceDto {
    name: string;
    description: string;
    speaker: string;
    location: {
        country: string;
        street: string;
        number: string;
        zip: string;
        state: string;
        locationDetails?: string;
    };
    startTime: string;
    endTime: string;
}
