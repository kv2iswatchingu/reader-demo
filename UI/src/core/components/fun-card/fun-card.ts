import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UiDialog } from '../ui-dialog/ui-dialog';

@Component({
  selector: 'fun-card',
  imports: [MatIcon],
  templateUrl: './fun-card.html',
  styleUrl: './fun-card.scss'
})
export class FunCard {;
  @Input() cardData: FunCardType = {
    name: 'defalut',
    cost: 9,
    orginCost: 9,
    description: 'defalut',
    imageList: {
      normalImage: '',
      changeImage: '',
      overImage: ''
    },
    atk: 13,
    originAtk: 13,
    def: 13,
    originDef: 13
  }

  hover = false
  destroy = false



  
 

}


export interface FunCardType {
  name:string,
  cost:number,
  orginCost:number,
  description:string,
  effect?:string[],
  imageList?:FunCardImage,
  type?:string,
  atk:number,
  originAtk:number,
  def:number,
  originDef:number
}

export interface FunCardImage {
  normalImage?:string,
  changeImage?:string,
  overImage?:string,
  //and ...
}