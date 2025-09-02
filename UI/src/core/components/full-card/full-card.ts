import { Component, Input } from '@angular/core';

@Component({
  selector: 'full-card',
  imports: [],
  templateUrl: './full-card.html',
  styleUrl: './full-card.scss'
})
export class FullCard {
  //@Input() rare: Rare = Rare.Common;
  @Input() cardData: FullCardType | null = null;
  //@Input() 

}
export enum Rare {
  Common,
  Rare,
  Enhaben,

}

export interface FullCardType {
  id: string;
  name: string;
  rare: Rare;
  img: string;
}