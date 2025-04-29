import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeGroupComponent } from './time-group.component';

describe('TimeGroupComponent', () => {
  let component: TimeGroupComponent;
  let fixture: ComponentFixture<TimeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
