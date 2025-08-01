import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.html',
  styleUrls: ['./ui-checkbox.scss'],
  standalone: true
})
export class UiCheckbox {
  @Input() label: string = '';
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    const val = (event.target as HTMLInputElement).checked;
    this.checked = val;
    this.checkedChange.emit(val);
  }
}