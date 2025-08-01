import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-form',
  imports: [CommonModule,FormsModule],
  templateUrl: './ui-form.html',
  styleUrl: './ui-form.scss'
})
export class UiForm {
  @Input() hideSubmit: boolean = false;
  @Output() submitForm = new EventEmitter<void>();

  onSubmit() {
    this.submitForm.emit();
  }
}
