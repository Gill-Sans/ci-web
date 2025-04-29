// src/app/core/models/checkin/checkinEvent.model.ts

/** The two event types we support */
export enum CheckinEventType {
    INITIAL_SNAPSHOT = 'INITIAL_SNAPSHOT',
    CHECKIN          = 'CHECKIN'
}

/** A single attendee’s check-in entry */
export interface CheckinSnapshotEntry {
    sessionId: string;
    userId:    string;
    firstName: string;
    lastName:  string;
}

/** Base for all events */
interface BaseEvent {
    eventType:    CheckinEventType;
    conferenceId: string;
}

/** The initial snapshot, sent once on connect */
export interface InitialSnapshotEvent extends BaseEvent {
    eventType: CheckinEventType.INITIAL_SNAPSHOT;
    checkins:  CheckinSnapshotEntry[];
}

/** A single new check-in, sent after the snapshot */
export interface CheckinEvent extends BaseEvent {
    eventType:  CheckinEventType.CHECKIN;
    sessionId:  string;
    userId:     string;
    firstName:  string;
    lastName:   string;
    instanceId: string;
}

/** Union of everything the socket can emit */
export type CheckinStreamMessage = InitialSnapshotEvent | CheckinEvent;
