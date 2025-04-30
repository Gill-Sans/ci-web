import {CheckinActionType} from './checkinTypes.model';

export interface CreateCheckinRequest {
    type: CheckinActionType;
    userId: string;
    conferenceId: string;
    sessionId: string;
}
