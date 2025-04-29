import {Component, Input} from '@angular/core';
import {Conference} from '../../../../core/models/conference/conference.model';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-conference-hero',
  imports: [
        CommonModule,
        MatIcon,
  ],
  templateUrl: './conference-hero.component.html',
  styleUrl: './conference-hero.component.scss'
})
export class ConferenceHeroComponent {
    @Input() conference!: Conference;
}
