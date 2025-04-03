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
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speaker: string;
  address?: Address;
  locationDetails?: string;
  conferenceId: string;
} 