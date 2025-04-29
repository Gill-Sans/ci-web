import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Address} from '../../../../core/models/address/address.model';

@Component({
    standalone: true,
    selector: 'app-conference-location',
    imports: [CommonModule],
    templateUrl: './conference-location.component.html',
    styleUrls: ['./conference-location.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConferenceLocationComponent {
    @Input() location!: Address;
}
