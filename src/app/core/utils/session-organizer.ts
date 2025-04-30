// src/app/core/utils/session-organizer.ts

import { SessionDetailsDto } from '../models/session/session.model';

export interface TimeGroup {
    time:     string;
    sessions: SessionDetailsDto[];
}

export interface OrganizedSessions {
    dates:   Date[];
    grouped: Record<string, TimeGroup[]>;
}

/**
 * Sorts sessions by their `startTime` in ascending order.
 *
 * @param sessions  unsorted list of sessions
 * @returns a new array sorted by startTime
 */
function sortByStartTime(sessions: SessionDetailsDto[]): SessionDetailsDto[] {
    return [...sessions].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
}

/**
 * Groups sessions into a Map keyed by the session date string (toDateString()).
 *
 * @param sessions  sessions already sorted by startTime
 * @returns a Map where each key is a date string and each value is the array of sessions on that day
 */
function groupByDay(
    sessions: SessionDetailsDto[]
): Map<string, SessionDetailsDto[]> {
    return sessions.reduce((map, sess) => {
        const dayKey = new Date(sess.startTime).toDateString();
        const list   = map.get(dayKey) ?? [];
        list.push(sess);
        map.set(dayKey, list);
        return map;
    }, new Map<string, SessionDetailsDto[]>());
}

/**
 * Extracts the keys of a day-map as Date objects, sorted ascending.
 *
 * @param dayMap  Map from dateString to a day’s sessions
 * @returns array of Date objects in ascending order
 */
function extractOrderedDates(
    dayMap: Map<string, SessionDetailsDto[]>
): Date[] {
    return Array
        .from(dayMap.keys())
        .map(ds => new Date(ds))
        .sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Buckets one day’s sessions into TimeGroup[] by their hour:minute.
 *
 * @param sessions  all sessions on a single date
 * @returns an array of TimeGroup, in the order times first appear
 */
function groupByTime(
    sessions: SessionDetailsDto[]
): TimeGroup[] {
    return sessions.reduce((groups, sess) => {
        const time = new Date(sess.startTime)
            .toLocaleTimeString(undefined, {
                hour:   '2-digit',
                minute: '2-digit',
            });
        let bucket = groups.find(g => g.time === time);
        if (!bucket) {
            bucket = { time, sessions: [] };
            groups.push(bucket);
        }
        bucket.sessions.push(sess);
        return groups;
    }, [] as TimeGroup[]);
}

/**
 * Full pipeline: sort, day-group, date list, then time-group per day.
 *
 * @param sessions  flat list of all sessions
 * @returns an object with sorted dates and grouped TimeGroups for UI binding
 */
export function organizeSessions(
    sessions: SessionDetailsDto[]
): OrganizedSessions {
    const sorted = sortByStartTime(sessions);
    const dayMap = groupByDay(sorted);
    const dates  = extractOrderedDates(dayMap);

    const grouped: Record<string, TimeGroup[]> = {};
    for (const date of dates) {
        const key          = date.toDateString();
        const daySessions  = dayMap.get(key)!;
        grouped[key]       = groupByTime(daySessions);
    }

    return { dates, grouped };
}
