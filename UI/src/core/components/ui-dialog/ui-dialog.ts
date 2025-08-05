import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-dialog',
  imports: [CommonModule,UiButton,MatIcon],
   templateUrl: './ui-dialog.html',
  styleUrls: ['./ui-dialog.scss'],
  standalone: true
})
export class UiDialog {
  @Input() title: string = '提示';
  @Input() noFooter: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Input() dialogWidth: number = 400;
  @Input() dialogHeight: number = 300;
  @Input() darkmode: boolean = false;

  confirmText: string = '确定';
  cancelText: string = '取消';

  onConfirm() {
    this.confirm.emit();
  }
  onClose() {
    this.close.emit();
  }
  /**
   * SLASH!
   */
  
}
