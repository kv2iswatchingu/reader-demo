import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-card',
  imports: [MatIcon,CommonModule],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.scss'
})
export class UICard {
  @Input() cardData: CardType | null = null;
  @Input() detailMode = false;
  @Input() disabled = false;
  @Output() cardDbClick = new EventEmitter<Event>();
  
  ripple = false;
  rippleX = 0;
  rippleY = 0;

  onCardClick(event:MouseEvent) {
    if (this.disabled) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.rippleX = event.clientX - rect.left;
    this.rippleY = event.clientY - rect.top;
    this.ripple = false;
    setTimeout(() => (this.ripple = true), 0);
    setTimeout(() => (this.ripple = false), 400);
  }
  onCardDblClick(event:MouseEvent) {
    if (this.disabled) return;
    this.cardDbClick.emit(event);
  }
}

export interface CardType  {
  name: string,
  path: string,
  size: number,
  isDirectory: boolean,
  isImage: boolean,
  isJson: boolean,
  birthtime: Date,
  mtime: Date
}