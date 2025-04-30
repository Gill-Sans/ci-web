import {TestBed} from '@angular/core/testing';

import {CheckinWebsocketService} from './checkin-stream.service';

describe('CheckinService', () => {
    let service: CheckinWebsocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CheckinWebsocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
