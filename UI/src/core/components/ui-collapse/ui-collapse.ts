import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-collapse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-collapse.html',
  styleUrls: ['./ui-collapse.scss']
})
export class UiCollapse {
  expanded = false;
  toggle() {
    this.expanded = !this.expanded;
  }
}