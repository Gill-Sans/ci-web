import { Address } from "../address/address.model";

export interface Conference {
    id: string;
    name: string;
    description: string;
    location: Address;
    startTime: string;
    endTime: string;
    checkinCount?: number;
}
