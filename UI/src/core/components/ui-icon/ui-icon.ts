import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-icon.html',
  styleUrls: ['./ui-icon.scss']
})
export class UiIcon {
  @Input() name: string = '';
  @Input() size: string = '1em';
  @Input() color: string = 'inherit';

  // 可选：支持自定义svg属性
}