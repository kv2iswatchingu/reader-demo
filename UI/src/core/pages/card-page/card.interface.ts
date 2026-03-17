export interface CardLibJson {
  createTime?: string;
  updateTime?: string;
  cards: FunCardType[];
}

export interface CardListJson {
  createTime?: string;
  updateTime: string;
  cardList: CardList[];
}

export interface CardList {
  name: string;
  time: string;
  card: FunCardType[];
  //
  //                 ｜
  //                 ｜
  //                 ｜
  //      -----------｜-----------
  //                 ｜
  //                 ｜
  //                 ｜
  //
  //
}

export interface FunCardTypeExtend extends FunCardType{
  id: string;
  atk: number;
  def: number;
  cost: number;
  canAttack?:boolean;
  showDetail?:boolean;

  //.....
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
}

export class Card {
  public cardData?:FunCardTypeExtend;

  constructor(cardData?:FunCardTypeExtend) {
    this.cardData = cardData
  }
  
  private enterSpecial() {
    
  }

  private leaveSpecial() {
    
  }

  private onSpecial() {
    
  }

  private useSpecial() {
    
  }

  private endSpecial() {
    
  }

  private mamori() {
    
  }

  private () {
    
  }




  private switchSpecial() {
    
  }





  public Attack() {
    
  }

  public Defend() {
    
  }

  public Effect() {
    
  }


  
  
}

/** 
 * ->interface -data - class -new()?
 * 1.BaseEffect 通过data词缀直接生效，类方法？继承，重写？
 *  词缀类型 emnu 时间/效果？
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
*/