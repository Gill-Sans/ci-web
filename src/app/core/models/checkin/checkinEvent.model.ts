import {CheckinDto} from './checkin.model';
import {CheckinEventType} from './checkinTypes.model';

interface BaseEvent {
    eventType:    CheckinEventType;
    conferenceId: string;
}

export interface InitialSnapshotEvent extends BaseEvent {
    eventType: CheckinEventType.INITIAL_SNAPSHOT;
    checkins:  CheckinDto[];
}

export interface CheckinEventMessage extends BaseEvent {
    eventType:    CheckinEventType.CHECK_IN | CheckinEventType.CHECK_OUT;
    checkin: CheckinDto;
}

/** Union of everything the socket can emit */
export type CheckinStreamMessage =
    | InitialSnapshotEvent
    | CheckinEventMessage;
