import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTabsComponent } from './session-tabs.component';

describe('SessionTabsComponent', () => {
  let component: SessionTabsComponent;
  let fixture: ComponentFixture<SessionTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
