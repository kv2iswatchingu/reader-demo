import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-card',
  imports: [MatIcon],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.scss'
})
export class UICard {
  @Input() cardData: CardType | null = null;
  @Input() detailMode = false;
  @Output() cardClick = new EventEmitter();
  @Output() cardDbClick = new EventEmitter();
  cardActive: boolean = false;

  onCardClick(event:MouseEvent) {
    this.cardActive = true;
    this.cardClick.emit(event);
  }
  onCardDblClick(event:MouseEvent) {
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