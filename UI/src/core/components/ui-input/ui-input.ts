import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'ui-input',
  imports: [CommonModule],
  templateUrl: './ui-input.html',
  styleUrls: ['./ui-input.scss'],
  standalone: true
})
export class UiInput {
  @Input() placeholder: string = '';
  @Input() value: any = '';
  @Input() type: string = 'text';
  @Input() minNumber: number | undefined;
  @Input() maxNumber: number | undefined;
  @Output() valueChange = new EventEmitter<any>();
  @Input() options: { label: string, value: any }[] = []; // 新增

  showDropdown = false;


  onInput(val: any) {
   this.value = val.target ? val.target.value : val; // 兼容 $event 直接传递
  this.valueChange.emit(this.value);
  this.showDropdown = Array.isArray(this.options) && this.options.length > 0;
  }

  onFocus() {
    this.showDropdown = !!this.options?.length;
  }

  onBlur() {
    setTimeout(() => this.showDropdown = false, 200); // 延迟隐藏，避免点击选项时消失
  }

  selectOption(opt: any) {
    this.value = opt.value;
    this.valueChange.emit(opt.value);
    this.showDropdown = false;
  }
}