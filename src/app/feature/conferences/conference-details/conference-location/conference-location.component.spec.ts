import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceLocationComponent } from './conference-location.component';

describe('ConferenceLocationComponent', () => {
  let component: ConferenceLocationComponent;
  let fixture: ComponentFixture<ConferenceLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
