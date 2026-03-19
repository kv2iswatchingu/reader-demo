//用于创建Card实例对象
export class Card {
  cardData:CardData
  currentAtk: number;
  currentDef: number;
  currentMaxDef: number;
  currentCost: number;

  guard: boolean = false;
  canAttack: boolean = false;
  pioneer : number | null = null;

  constructor(public data:CardData){
    this.cardData = data;
    this.currentDef = this.cardData.def;
    this.currentMaxDef = this.cardData.def;
    this.currentAtk = this.cardData.atk;
    this.currentCost = this.cardData.cost;
    this.canAttack = false;
    this.guard = !!this.cardData.effect?.some(e => e.effectType === EffectType.Guard);
    if (this.cardData.effect?.some(e => e.effectType === EffectType.Pioneer)) {
      this.pioneer = null; // 出场时设置
    }
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

  //攻击选择目标
  attackChooseTarget(enemies: Card[],enemyCharacter: Character,pioneer?: number | null): Promise<Card | Character> {
    return new Promise((resolve, reject) => {
      const guardCards = enemies.filter(enemy => enemy.guard);
      let selectable: (Card | Character)[] = guardCards.length > 0 ? guardCards : enemies;

      if (pioneer === 0) {
      } else if (enemyCharacter) {
        selectable = [...selectable, enemyCharacter];
      }
      window.dispatchEvent(new CustomEvent('chooseAttackTarget', { detail: { selectable, resolve } }));
    });
  }

  //能力选择目标
  effectChooseTarget(): Promise<Card | Character>{
    return new Promise((resolve,reject) => {
      // 事件
      window.dispatchEvent(new CustomEvent('chooseEffectTarget'))
    })
  }
  /**
   * 
   * 
   */

  // 出场时调用
  setCardCanAttack(card: Card) {
    const effects = card.cardData.effect || [];
    if (effects.some(e => e.effectType === EffectType.Speed)) {
      card.canAttack = true;
      card.pioneer = null;
    } else if (effects.some(e => e.effectType === EffectType.Pioneer)) {
      card.canAttack = true;
      card.pioneer = 0;
    } else {
      card.canAttack = false;
      card.pioneer = null;
    }
  }


  resetCardAttackStatus(cards: Card[]) {
    cards.forEach(card => { 
      card.canAttack = true;
      card.pioneer = null;
    });
  }

  //攻击
  async attackCard(card: Card, enemies: Card[],enemyCharacter: Character) {
    if (!card.canAttack) return; 

    const target = await this.attackChooseTarget(enemies,enemyCharacter);
    if (target instanceof Card) {
      target.currentDef -= card.currentAtk;
      card.currentDef -= target.currentAtk;
    }else{
      target.currentHealth -= card.currentAtk;
    }
  }
  
  //效果
  async applyEffect(card:Card,Allies:Card[],Enemies:Card[],Self:Character,Enemy:Character,deck:Card[],hand:Card[]){
    if(!card.cardData.effect) return
    card.cardData.effect?.forEach(async effect => {
      switch(effect.effectType){
        case EffectType.Damage:
            switch(effect.effectTarget){
              case EffectTarget.All:
                this.effectDamageAll(effect,Allies,Enemies,Self,Enemy);
                break;
              case EffectTarget.Choose:
                const target = await this.effectChooseTarget();
                this.effectDamageTarget(effect,target);
                break;
              case EffectTarget.EnemyAll:
                this.effectDamegeEnemyAll(effect,Enemies);
                break;
              case EffectTarget.EnemyCodition:
                this.effectDamegeEnemyCod(effect,Enemies);
                break;
              case EffectTarget.EnemyCharacter:
                this.effectDamegeEnemyCharacter(effect,Enemy);
                break;
            }
            break;
        
        case EffectType.Heal:
          switch(effect.effectTarget){
            case EffectTarget.AlliesCharacter:
              break;
            case EffectTarget.AlliesAll:
              break;
          }
          break;

        case EffectType.Buff:
          switch(effect.effectTarget){
            case EffectTarget.AlliesAll:
              break;
          }
          break;

        case EffectType.AddCard:
          this.effectAddCard(effect, deck, hand);
           break;
        //Base
        //case EffectType.Guard.Pioneer.Speed


      }
    })
  }


  //Effect.Damage 
  effectDamageAll(effect:Effect,Allies:Card[],Enemies:Card[],Self:Character,Enemy:Character){
    const damage = effect.firstValue;
    Allies.forEach(card => card.currentDef -= damage);
    Enemies.forEach(card => card.currentDef -= damage);
    Self.currentHealth -= damage;
    Enemy.currentHealth -= damage;
  }
  effectDamegeEnemyAll(effect:Effect,Enemies:Card[]){
    const damage = effect.firstValue;
    Enemies.forEach(card => card.currentDef -= damage);
  }
  effectDamegeEnemyCharacter(effect:Effect,Enemy:Character){
    const damage = effect.firstValue;
    Enemy.currentHealth -= damage;
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

  //Effect.Heal
  effectHealAlliesAll(effect:Effect,Allies:Card[]){
    const heal = effect.firstValue;
    Allies.forEach(card => {
      if(card.currentDef + heal > card.currentMaxDef){
        card.currentDef = card.currentMaxDef;
      }else{
        card.currentDef += heal
      }
    });
  }
  effectHealAlliesCharacter(effect:Effect,Self:Character){
    const heal = effect.firstValue;
    if(Self.currentHealth + heal > Self.characterData.health){
      Self.currentHealth = Self.characterData.health;
    }else{
      Self.currentHealth += heal
    }
  }
  //Effect.Buff
  effectBuffAlliesAll(effect:Effect,Allies:Card[]){
    const buffAtk = effect.firstValue;
    const buffDef = effect.secondValue;
    Allies.forEach(card => {
      card.currentAtk += buffAtk;
      card.currentMaxDef += buffDef ? buffDef : 0;
      card.currentDef += buffDef ? buffDef : 0;
    });
  }
  //Effect.AddCard
  effectAddCard(effect: Effect, deck: Card[], hand: Card[]) {
    const drawCount = effect.firstValue;
    for (let i = 0; i < drawCount; i++) {
      if (deck.length > 0) {
        const drawnCard = deck.shift(); // 从牌库顶抽一张
        if (drawnCard) hand.push(drawnCard); // 加入手牌
      }
    }
  }
  //BaseEffect
  

  //
  
  
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
  All = "All",//-with chara
  EnemyCharacter = "EnemyCharacter",
  EnemyAll = "EnemyAll", // -no chara
  EnemyCodition = "EnemyCodition",
  AlliesCharacter = "AlliesCharacter",
  AlliesAll = "AlliesAll", // -no chara
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
  Guard = "Guard",
  Pioneer = "Pioneer",
  Speed = "Speed",
  Hide = "Hide",
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