import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-button.html',
  styleUrls: ['./ui-button.scss']
})
export class UiButton {
@Input() themeType: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() modeType: 'standard' | 'text' | 'icon' | 'circle' = 'standard';
  @Input() customClass: string = '';
  @Input() easyAnimation: boolean = false;
  @Input() disabled: boolean = false;

  @Output() btnClick = new EventEmitter<Event>();

  ripple = false;
  rippleX = 0;
  rippleY = 0;

  onClick(event: MouseEvent) {
    if (this.disabled) return;
    this.btnClick.emit(event);
    if (!this.easyAnimation) {
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.rippleX = event.clientX - rect.left;
      this.rippleY = event.clientY - rect.top;
      this.ripple = false;
      setTimeout(() => (this.ripple = true), 0);
      setTimeout(() => (this.ripple = false), 400);
    }
  }
}