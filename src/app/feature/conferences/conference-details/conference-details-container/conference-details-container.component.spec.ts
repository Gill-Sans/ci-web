import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceDetailsContainerComponent } from './conference-details-container.component';

describe('ConferenceDetailsContainerComponent', () => {
  let component: ConferenceDetailsContainerComponent;
  let fixture: ComponentFixture<ConferenceDetailsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceDetailsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
