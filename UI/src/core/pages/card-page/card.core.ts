//用于创建Card实例对象
export class Card {
  cardData:CardData
  currentAtk: number;
  currentDef: number;
  currentCost: number;

  constructor(public data:CardData){
    this.cardData = data;
    this.currentDef = this.cardData.def;
    this.currentAtk = this.cardData.atk;
    this.currentCost = this.cardData.cost
  }

  getCardImage(){
    if(this.currentDef < this.cardData.def / 2){
      return this.cardData.imageSecond
    }else{
      return this.cardData.image
    }
  }
}
//用于创建charcter实例对象
export class Character {
  characterData:CharacterData
  currentHealth: number;

  constructor(data:CharacterData){
    this.characterData = data
    this.currentHealth = this.characterData.health
  }

  getCharacterImage(){
    if(this.currentHealth < this.characterData.health / 2){
      return this.characterData.imageSecond
    }else{
      return this.characterData.image
    }
  }

  

}


///用于处理所有的效果事件
export class CardSystem {

  // hand field gravey 
  static attackCard(card:Card,target:Card){
    target.currentDef -= card.currentAtk;
    card.currentDef -= target.currentAtk;
  }

  static attackCharacter(card:Card,target:Character){
    target.currentHealth -= card.currentAtk;
  }

  async applyEffect(card:Card,Allies:Card[],Enemies:Card[],Self:Character,Enemy:Character){
    if(!card.cardData.effect) return
    card.cardData.effect?.forEach(async effect => {
      switch(effect.effectType){
        case EffectType.Damage:
            switch(effect.effectTarget){
              case EffectTarget.All:
                this.effectDamageAll(effect,Allies,Enemies,Self,Enemy);
                break;
              case EffectTarget.Choose:
                const target = await this.chooseTarget();
                this.effectDamageTarget(effect,target);
                break;
              case EffectTarget.EnemyAll:
                this.effectDamegeEnemy(effect,Enemies);
                break;
              case EffectTarget.EnemyCodition:
                this.effectDamegeEnemyCod(effect,Enemies);
                break;
            }
            break;
        //case EffectType.
      }
    })
  }

  chooseTarget(): Promise<Card | Character>{
    return new Promise((resolve,reject) => {
      // 事件
      window.dispatchEvent(new CustomEvent('chooseTarget'))
    })
  }

  effectDamageAll(effect:Effect,Allies:Card[],Enemies:Card[],Self:Character,Enemy:Character){
    const damage = effect.firstValue;
    Allies.forEach(card => card.currentDef -= damage);
    Enemies.forEach(card => card.currentDef -= damage);
    Self.currentHealth -= damage;
    Enemy.currentHealth -= damage;
  }

  effectDamegeEnemy(effect:Effect,Enemies:Card[]){
    const damage = effect.firstValue;
    Enemies.forEach(card => card.currentDef -= damage);
  }

  effectDamegeEnemyCod(effect:Effect,Enemies:Card[]){
    let damage = effect.firstValue;
    for(let i = 0; i < Enemies.length; i++){
      if( Enemies[i].currentDef < damage){
        Enemies[i].currentDef = 0;
        damage -= Enemies[i].currentDef;
      }else{
        Enemies[i].currentDef -= damage;
        damage = 0;
      }
    }
  }
  
  effectDamageTarget(effect:Effect,target:Card | Character){
    const damage = effect.firstValue;
    if(target instanceof Card ){
      target.currentDef -= damage;
    }else{
      target.currentHealth -= damage
    }
  }
  


  
}

//174 92

export interface CardData {
  cost: number;
  name: string;
  type: string;

  atk: number;
  def: number;
  effect?: Effect[];
  
  description: string;
  image:string;
  imageSecond?:string;

}

export interface CharacterData {
  name: string;
  health: number;
  image:string;
  imageSecond:string;
}

export interface Effect {
  effectTrigger: string;
  effectType: string;
  effectTarget: string;
  firstValue: number;
  secondValue?: number;
  backupValue?: number;
}

export enum CardType {
  Area = "Area",
  Magic = "Magic",
  Servent = "Servent",
  Lord = "Lord"
}

export enum EffectTrigger{
  Using = "Using",
  Ending = "Ending",
  At = "At",
}

export enum EffectTarget{
  Self = "Self",
  All = "All",
  EnemyAll = "EnemyAll",
  EnemyCodition = "EnemyCodition",
  AlliesAll = "AlliesAll",
  AlliesNext = "AlliesNext",
  Choose = "Choose",
}

export enum EffectType{
  Damage = "Damage",
  Buff = "Buff",
  Heal = "Heal",
  AddCard = "AddCard",
  Destory = "Destory",
  Disappear = "Disapper",
  //base
  Hide = "Hide",
  Guard = "Guard",
  Pioneer = "Pioneer",
  Speed = "Speed",
  Great = "Great",
  Unbreakable = "Unbreakable",
  Cut = "Cut",
  Erhaben = "Erhaben",
}
 



/** 
 * ->interface -data - class -new()?
 * 1.BaseEffect 通过data词缀直接生效，类方法？
 *  词缀类型 emnu 时间 / 效果？
 * 
 * 2. 复杂Effect ? 继承，重写 BaseEffect?
 *    直接新增Effect 特别名称匹配
 * 
 * 
 * 4.
 * 
 * 
 * 
 * 
 * 
*/

// export interface CardLibJson {
//   createTime?: string;
//   updateTime?: string;
//   cards: FunCardType[];
// }

// export interface CardListJson {
//   createTime?: string;
//   updateTime: string;
//   cardList: CardList[];
// }

// export interface CardList {
//   name: string;
//   time: string;
//   card: FunCardType[];

// }

// export interface FunCardTypeExtend extends FunCardType{
//   id: string;
//   atk: number;
//   def: number;
//   cost: number;
//   canAttack?:boolean;
//   showDetail?:boolean;

//   //.....
// }


// export interface FunCardType {
//   name:string,//唯一
//   orginCost:number,
//   description:string,
//   effect?:Effect[],
//   imageList?:FunCardImage,
//   class?:CardClass,
//   tag?:CardTag[],
//   originAtk:number,
//   originDef:number
// }

// export enum CardTag {
  
// }

// export interface Effect {
//   effectTime:EffectTime,
//   effectType:EffectType,
//   firstValue:number,
//   secondValue?:number,
//   thirdValue?:number,
//   doTimes?:number
// }

// export enum EffectTime {
//   Enter = "Enter",
//   Leave = "Leave",
//   Begin = "Begin",
//   End = "End",
//   All = "All",
// }

// export enum EffectType {
  
// }

// export interface FunCardImage {
//   normalImage?:string,
//   changeImage?:string,
//   overImage?:string,
// }



// export enum CardClass  {
//   Area = "Area",
//   Magic = "Magic",
//   Servent = "Servent",
//   Hero = "Hero",
// }