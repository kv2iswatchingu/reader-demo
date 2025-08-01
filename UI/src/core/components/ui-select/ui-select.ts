import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-select',
  imports: [CommonModule],
  templateUrl: './ui-select.html',
  styleUrls: ['./ui-select.scss'],
  standalone: true
})
export class UiSelect {
  @Input() options: { label: string, value: any }[] = [];
  @Input() placeholder: string = '请选择';
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  onChange(e: any) {
    this.value = e.target.value;
    this.valueChange.emit(e.target.value);
  }
}