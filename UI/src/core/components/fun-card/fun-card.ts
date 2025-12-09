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
  name:string,//唯一
  orginCost:number,
  description:string,
  effect?:Effect[],
  imageList?:FunCardImage,
  class?:CardClass,
  tag?:CardTag[],
  originAtk:number,
  originDef:number
}

export enum CardClass  {
  Area = "Area",
  Magic = "Magic",
  Servent = "Servent",
  Hero = "Hero",
}

export enum CardTag {
  
}

export interface Effect {
  effectTime:EffectTime,
  effectType:EffectType,
  firstValue:number,
  secondValue?:number,
  thirdValue?:number,
  doTimes?:number
}

export enum EffectTime {
  Enter = "Enter",
  Leave = "Leave",
  Begin = "Begin",
  End = "End",
  All = "All",
}

export enum EffectType {
  
}

export interface FunCardImage {
  normalImage?:string,
  changeImage?:string,
  overImage?:string,
  //and ...
}