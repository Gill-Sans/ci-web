export interface Conference {
    id: string;
    name: string;
    description: string;
    speaker: string;
    country: string;
    street: string;
    number: string;
    zip: string;
    state: string;
    locationDetails?: string;
    startTime: string;
    endTime: string;
}
