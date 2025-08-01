import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiIcon } from '../ui-icon/ui-icon'
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-dialog',
  imports: [CommonModule, UiIcon, UiButton],
   templateUrl: './ui-dialog.html',
  styleUrls: ['./ui-dialog.scss'],
  standalone: true
})
export class UiDialog {
  @Input() title: string = '提示';
  @Input() noFooter: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  confirmText: string = '确定';
  cancelText: string = '取消';

  onConfirm() {
    this.confirm.emit();
  }
  onClose() {
    this.close.emit();
  }

  
}
