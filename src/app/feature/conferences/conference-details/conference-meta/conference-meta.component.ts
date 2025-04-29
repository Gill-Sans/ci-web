import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Conference} from '../../../../core/models/conference/conference.model';
import {MatIcon} from '@angular/material/icon';


@Component({
    standalone: true,
    selector: 'app-conference-meta',
    imports: [
        CommonModule,
        MatIcon
    ],
    templateUrl: './conference-meta.component.html',
    styleUrls: ['./conference-meta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConferenceMetaComponent {
    @Input() conference!: Conference;
}
