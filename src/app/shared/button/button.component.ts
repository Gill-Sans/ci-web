import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [
    CommonModule,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() variant: "neutral" | "primary" | "secondary" = "neutral";
  @Input() disabled: boolean = false;
  @Input() type: "button" | "submit" = "button";

  constructor() {}
}
