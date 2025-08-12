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
  @Input() dialogWidth: string = '400px';
  @Input() dialogHeight: string = '300px';
  @Input() darkmode: boolean = false;

  confirmText: string = '确定';
  cancelText: string = '取消';

  onConfirm() {
    this.confirm.emit();
  }
  onClose() {
    //@ts-ignore
    window.electronAPI?.setFullscreen?.(false);
    this.close.emit();
  }
  
}
