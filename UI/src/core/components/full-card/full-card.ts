import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'full-card',
  imports: [MatIcon],
  templateUrl: './full-card.html',
  styleUrl: './full-card.scss'
})
export class FullCard {;
  @Input() cardData: FullCardType | null  = null;
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


export interface FullCardType {
  label: string,
  value: number,
  type: string
}