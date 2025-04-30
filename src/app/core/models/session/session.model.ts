import {Address} from '../address/address.model';

export interface SessionPreviewDto {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    speaker: string;
    address?: Address;
    locationDetails?: string;
}

export interface SessionDetailsDto {
    id: string;
    sessionId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    speaker: string;
    address?: Address;
    locationDetails?: string;
    conferenceId: string;
    checkinCount?: number;
}
