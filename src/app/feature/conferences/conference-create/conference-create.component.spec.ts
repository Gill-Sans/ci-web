import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConferenceCreateComponent} from './conference-create.component';

describe('ConferenceCreateComponent', () => {
    let component: ConferenceCreateComponent;
    let fixture: ComponentFixture<ConferenceCreateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConferenceCreateComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConferenceCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
