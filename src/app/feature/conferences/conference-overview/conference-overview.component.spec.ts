import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceOverviewComponent } from './conference-overview.component';

describe('ConferenceOverviewComponent', () => {
  let component: ConferenceOverviewComponent;
  let fixture: ComponentFixture<ConferenceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
