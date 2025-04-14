import {Address} from "../address/address.model";

export interface CreateConferenceDto {
    name: string;
    description: string;
    location: Address;
    startTime: string;
    endTime: string;
}
