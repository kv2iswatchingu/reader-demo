import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UiDialog } from '../ui-dialog/ui-dialog';
import { FunCardTypeExtend } from '../../pages/card-page/card-battle/card-battle';

@Component({
  selector: 'fun-card',
  imports: [MatIcon],
  templateUrl: './fun-card.html',
  styleUrl: './fun-card.scss'
})
export class FunCard {;
  @Input() cardData?: FunCardTypeExtend;
  @Input() orignCardData?: FunCardType;

  hover = false
  destroy = false



  
 

}


export interface FunCardType {
  name:string,
  orginCost:number,
  description:string,
  effect?:string[],
  imageList?:FunCardImage,
  type?:string,
  originAtk:number,
  originDef:number
}

export interface FunCardImage {
  normalImage?:string,
  changeImage?:string,
  overImage?:string,
  //and ...
}