import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
//import { FunCardType, FunCardTypeExtend } from '../card.interface';

@Component({
  selector: 'fun-card',
  imports: [
    //MatIcon
  ],
  templateUrl: './fun-card.html',
  styleUrl: './fun-card.scss'
})
export class FunCard {
  //@Input() cardData?: FunCardTypeExtend;
  //@Input() orignCardData?: FunCardType;
  @Input() detailPosition: string = '';

  showDetail:boolean = false;
  delay:number = 1500;
  delayTimer?:any;

  mouseEnter(){
    console.log('mouseEnter');
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.showDetail = true;
    },this.delay)
  }
  mouseLeave(){
    clearTimeout(this.delayTimer);
    this.showDetail = false;
  }

  ngDestory(){
    clearTimeout(this.delayTimer);
  }
}

