import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'poker-card',
  imports: [MatIcon],
  templateUrl: './poker-card.html',
  styleUrl: './poker-card.scss'
})
export class PokerCard {;
  @Input() cardData: PokerCardType | null  = null;
  @Input() notFull:boolean = false;
  @Input() backshow: boolean = false;
  @Input() allowHover: boolean = false;

  halfNumber: number = 0;
  isOdd: boolean = false;
  ngOnInit() {
    if(this.cardData){
      this.halfNumber = Math.floor(this.cardData.value / 2);
      this.isOdd = this.cardData!.value % 2 === 1;
    }
  }
}


export interface PokerCardType {
  label: string,
  value: number,
  type: string
}