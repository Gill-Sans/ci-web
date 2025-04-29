import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceHeroComponent } from './conference-hero.component';

describe('ConferenceHeroComponent', () => {
  let component: ConferenceHeroComponent;
  let fixture: ComponentFixture<ConferenceHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
