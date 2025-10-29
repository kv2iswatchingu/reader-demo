import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UiDialog } from '../ui-dialog/ui-dialog';

@Component({
  selector: 'fun-card',
  imports: [],
  templateUrl: './fun-card.html',
  styleUrl: './fun-card.scss'
})
export class FunCard {;
  @Input() cardData: FunCardType | null  = null;

  hover = false
  destroy = false



  
 

}


export interface FunCardType {
  id:string
  name:string,
  cost:number,
  description:string,
  effect?:string[],
  imageList?:FunCardImage,
  type?:string,
  atk:number,
  def:number,

}

export interface FunCardImage {
  normalImage:string,
  changeImage:string,
  overImage:string,
  //and ...
}