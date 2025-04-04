import { Address } from '../address/address.model';

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
  id?: string;             // Traditional ID field
  sessionId?: string;      // Database field name
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speaker: string;
  address?: Address;
  locationDetails?: string;
  conferenceId: string;
  checkinCount?: number;   // Check-in count from the backend
} 