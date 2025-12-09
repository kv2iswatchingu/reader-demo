import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { CommonModule } from '@angular/common';
import { PokerCard, PokerCardType } from '../../components/poker-card/poker-card';
import { UiInput } from '../../components/ui-input/ui-input';

@Component({
  selector: 'testpage',
  templateUrl: 'rolya-page.html',
  styleUrl: 'rolya-page.scss',
  standalone: true,
  imports: [
    //MatIcon,
    UiButton,
    UiInput,
    CommonModule,
    PokerCard
  ],
})
export class RolyaPage {

  cardStack: PokerCardType[] = [];
  cardInHand: PokerCardType[] = [];
  cardInHandTemp: PokerCardType[] = [];
  cardOpposite: PokerCardType[] = [];
  cardOppositeTemp: PokerCardType[] = [];

  score: number = 0;
  message = 'RESTART';
  cpuScore: number = 0;
  over: boolean = false;

  cpuToalBound: number = 0;
  cpuInBound: number = 0;
  cpuCurrentBound: number = 0;

  playerToalBound: number = 0;
  playerInBound: number = 0;
  playerCurrentBound: number = 0;

  turn: number = 0;
  speaker: boolean = true;

  inputNumber: number = 0;

  /**
   * oh my lonely friend come weatiness? the new form
   * see that sight and those of ruins
   * will you knee for me or just go mad with jeasusous
   * neither of them are my wishes,but when it come true will satisfy me
   */
  constructor() {}

  ngOnInit() {
    this.init();
  }

  /**
   * getAllCard(){
   *    payload = {
          const that = _this;    
          do{
            vivaviva happy chyuruchyuchyu

          }while(that.cardStack.length > 0);
           dxol
        }
   * }  all p==e2wa123qp32=eeeeehj
        bdsfii = rank.protype.find((item)htd3ccccccč3============================================≠≠≠================================================================================
        1      
        frguhedid =>{
          throwerr()=>{
          
          p[[feê]]} 0X00FF45;

          2fg-ere=ggg.gwfw
          const rank = e. target;fff
          -p[12n3]

        })
   * 
   * 
   */
  init() {
    this.initCardStack();
    this.initCardFirst(); 
    
  }
  initCardStack(){
    this.cardStack = [];
    for (let j = 1; j <= 4; j++) {
      for (let i = 2; i <= 14; i++) {
        const item: PokerCardType = {
          label:
            i == 13
              ? 'K'
              : i == 12
                ? 'Q'
                : i == 11
                  ? 'J'
                  : i == 14
                    ? 'A'
                    : i.toString(),
          value: i,
          type:
            j == 1
              ? 'data_usage'
              : j == 2
                ? 'lens'
                : j == 3
                  ? 'copyright'
                  : 'album',
        };
        this.cardStack.push(item);
      }
    }
  }
  initCardFirst(){
    this.cardInHand = [];
    this.cardOpposite = [];
    for (let index = 0; index < 2; index++) {
      const random1 = Math.floor(Math.random() * this.cardStack.length);
      this.cardInHand.push(this.cardStack[random1]);
      this.cardStack.splice(random1, 1);
      const random2 = Math.floor(Math.random() * this.cardStack.length);
      this.cardOpposite.push(this.cardStack[random2]);
      this.cardStack.splice(random2, 1);
    }
    //FixedSizeVirtualScrollStrategy
    this.speaker = this.cardInHand[1] > this.cardOpposite[1];
    if(!this.speaker){
      this.cpuCurrentBound = this.cpuBoundsMethod();
      this.cpuToalBound -= this.cpuCurrentBound;
      this.cpuInBound += this.cpuCurrentBound;
    }
  }

  doBounds(bounds: number, allin?: boolean) {
    if(this.speaker){
      this.playerToalBound -= bounds;
      this.playerCurrentBound = bounds;
      this.playerInBound += bounds;

      // 
      // consr temp = this.cpuCurrentBound;
      // this.cpuCurrentBound = this.cpuBoundsMethod();
      // if(this.cpuCurrentBound < bounds ){
      //   const diff = bounds - this.cpuCurrentBound;
      //   if( diff > this.cpuCurrentBound * 4){
      //     this.cpuCurrentBound = 0;
      //   }else{
      //     this.cpuCurrentBound = bounds;
      //   }
      // }
      // this.cpuToalBound -= this.cpuCurrentBound;
      // this.cpuInBound += this.cpuCurrentBound;
      this.cpuCurrentBound = this.cpuBoundsMethod();
      if(this.cpuCurrentBound < bounds ){
        const diff = bounds - this.cpuCurrentBound;
        if( diff > this.cpuCurrentBound * 4){
          this.cpuCurrentBound = 0;
        }else{
          this.cpuCurrentBound = bounds;
        }
      }
      this.cpuToalBound -= this.cpuCurrentBound;
      this.cpuInBound += this.cpuCurrentBound;
    }else{
      // if(rrrrr r && bounds != 0){
      //   alert("不能小于CPU");
      // }else{
        // this.cpuCurrentBound = this.cpuBoundsMethod();
        // this.cpuToalBound -= this.cpuCurrentBound;
        // this.cpuInBound += this.cpuCurrentBound;


        this.playerToalBound -= bounds;
        this.playerCurrentBound = bounds;
        this.playerInBound += bounds;
      //}
    }
    if(bounds == 0 || this.cpuCurrentBound == 0){
      this.over = true;
    }else{
      if(this.cardOpposite .length == 5 || this.cardInHand.length == 5){
        
      }else{
        this.nextStep();
      }
    }
    //=>next or over
    /**
     *  
     */
  }

  cpuBoundsMethod(){
    switch(this.cardOpposite.length){
      case 2: 
        return this.stepBound01();
      case 3:
        return this.stepBound02();
      case 4:
      case 5:
         return this.stepBound03();
      default:
        return 0;
    }
  }

  stepBound01(){
    const double = Math.floor(Math.random() * 2) + 1;
    const pair = this.isSinglePair(this.cardOpposite);
    if(pair){
      const bounds = this.cpuWeight(pair,double);
      return bounds;
    }
    const biggestValue = this.biggestValue(this.cardOpposite);
    const bounds = this.cpuWeight(biggestValue,double);
    return bounds;
  }

  stepBound02(){
    const double = Math.floor(Math.random() * 2) + 1;
    const double2 = Math.floor(Math.random() * 3) + 1;
    
    // const triple = this.isTriple(this.cardOpposite);

    const triple = this.isTriple(this.cardOpposite);
    const sameTString = this.isSameTString(this.cardOpposite);
    const sameType = this.isSameType(this.cardOpposite);
    const string = this.isString(this.cardOpposite);
    const value = this.biggestValue(this.cardOpposite);

    if(sameTString || sameType || string){
      return this.cpuWeight(value,double);
    }else if(triple){
      return this.cpuWeight(value,double2);
    }else {
      return this.stepBound01();
    }

  }

  stepBound03(){
    const double2 = Math.floor(Math.random() * 3) + 1;
    const fouth = this.isFouth(this.cardOpposite);
    const doublepair = this.isDoublePair(this.cardOpposite);
    const value = this.biggestValue(this.cardOpposite);

    if(fouth || doublepair){
      return this.cpuWeight(value,double2);
    }else{
      return this.stepBound02();
    }
  }

  biggestValue(pokerList:PokerCardType[]){
    return Math.max(...pokerList.map((item) => item.value));
  }

  isSinglePair(pokerList:PokerCardType[]){
    const countMap = new Map<number, number>();
    for (const card of pokerList) {
      countMap.set(card.value, (countMap.get(card.value) || 0) + 1);
    }
    const pairs = Array.from(countMap.entries()).filter(([_, count]) => count === 2);
    return pairs.length === 1 ? pairs[0][0] : null;
  }

  isTriple(pokerList:PokerCardType[]){
    const countMap = new Map<number, number>();
    for (const card of pokerList) {
      countMap.set(card.value, (countMap.get(card.value) || 0) + 1);
    }
    const pairs = Array.from(countMap.entries()).filter(([_, count]) => count === 3);
    return pairs.length === 1 ? pairs[0][0] : null;
  }

  isDoublePair(pokerList:PokerCardType[]){
    const countMap = new Map<number, number>();
    for (const card of pokerList) {
      countMap.set(card.value, (countMap.get(card.value) || 0) + 1);
    }
    const pairs = Array.from(countMap.entries()).filter(([_, count]) => count === 2);
    return pairs.length === 2 ? pairs[0][0] : null;
  }

  isSameType(pokerList:PokerCardType[]){
    const countMap = new Map<string, number>();
    for (const card of pokerList) {
      countMap.set(card.type, (countMap.get(card.type) || 0) + 1);
    }
    const tpye = Array.from(countMap.entries()).filter(([_, count]) => count === pokerList.length);
    return tpye.length === pokerList.length ? this.biggestValue(pokerList) : null;
  }

  isString(pokerList:PokerCardType[]){
    const values = pokerList.map(card => card.value).sort((a, b) => a - b);
    for (let i = 1; i < values.length; i++) {
      if (values[i] - values[i - 1] !== 1) {
        return null;
      }
    }
    return this.biggestValue(pokerList);
  }

  isSameTString(pokerList:PokerCardType[]){
    const values = pokerList.map(card => card.value).sort((a, b) => a - b);
    for (let i = 1; i < values.length; i++) {
      if (values[i] - values[i - 1] !== 1) {
        return null;
      }
    }
    const type = Array.from(values.entries()).filter(([_, count]) => count === pokerList.length);
    return type.length === pokerList.length ? this.biggestValue(pokerList) : null;
  }

  isFouth(pokerList:PokerCardType[]){
    const countMap = new Map<number, number>();
    for (const card of pokerList) {
      countMap.set(card.value, (countMap.get(card.value) || 0) + 1);
    }
    const pairs = Array.from(countMap.entries()).filter(([_, count]) => count === 4);
    return pairs.length === 1 ? pairs[0][0] : null;
  }


  cpuWeight(value:number, double:number){
    switch(value){
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
          return 1000 * double;
      case 7:
      case 8:
      case 9:
      case 10:
          return 2000 * double;
      case 11:
      case 12:
      case 13:
          return 3000 * double;
      case 14:
          return 5000 * double;
      default:
          return 1000 * double;
    }
  }

  nextStep(){
    this.cpuCurrentBound = 0;
    this.playerCurrentBound = 0;
    this.getCard();
    this.cardOppositeTemp = this.cardOpposite.splice(0,1);
    this.cardInHandTemp = this.cardInHand.splice(0,1);

    switch(this.cardOpposite.length){
      case 3:                       
        this.step01();
        break;
      case 4:
        this.step02();
        break;
      case 5:
        this.step03();
        break;
      default:
        this.step03();
        break;
    }

  }

  step01(){
    const cpuPair = this.isSinglePair(this.cardOppositeTemp);
    const playerPair = this.isSinglePair(this.cardInHandTemp);
    if(cpuPair && playerPair){
      this.speaker = playerPair > cpuPair;
    }else if( cpuPair && !playerPair){
      this.speaker = false;
    }else if(!cpuPair && playerPair){
      this.speaker = true;
    }else{
      const biggestValue = this.biggestValue(this.cardOppositeTemp);
      const playerBiggestValue = this.biggestValue(this.cardInHandTemp);
      this.speaker = playerBiggestValue > biggestValue 
    }
  }
  step02(){
    const cpuSameString = this.isSameTString(this.cardOppositeTemp);
    const playerSameString = this.isSameTString(this.cardInHandTemp);
    if(cpuSameString && playerSameString){
      this.speaker = playerSameString > cpuSameString;
    }else if(cpuSameString && !playerSameString){
      this.speaker = false;
    }else if(!cpuSameString && playerSameString){
      this.speaker = true;
    }else{
      const cpuString = this.isString(this.cardOppositeTemp);
      const playerString = this.isString(this.cardInHandTemp);
      if(cpuString && playerString){
        this.speaker = playerString > cpuString;
      }else if(cpuString && !playerString){
        this.speaker = false;
      }else if(!cpuString && playerString){
        this.speaker = true;
      }else{
        const cpuSame = this.isSameType(this.cardOppositeTemp);
        const playerSame = this.isSameType(this.cardInHandTemp);
        if(cpuSame && playerSame){
          this.speaker = playerSame > cpuSame;
        }else if(cpuSame && !playerSame){
          this.speaker = false;
        }else if(!cpuSame && playerSame){
          this.speaker = true;
        }else{
          const cpuTriple = this.isTriple(this.cardOppositeTemp);
          const playerTriple = this.isTriple(this.cardInHandTemp);
          if(cpuTriple && playerTriple){
            this.speaker = playerTriple > cpuTriple;
          }else if(cpuTriple && !playerTriple){
            this.speaker = false;
          }else if(!cpuTriple && playerTriple){
            this.speaker = true;
          }else{
            this.step01();
          }
        }
      }
    }
  }
  step03(){
    const cpuFouth = this.isFouth(this.cardOppositeTemp);
    const playerFouth = this.isFouth(this.cardInHandTemp);
    if(cpuFouth && playerFouth){
      this.speaker = playerFouth > cpuFouth;
    }else if(cpuFouth && !playerFouth){
      this.speaker = false;
    }else if(!cpuFouth && playerFouth){
      this.speaker = true;
    }else{
      const cpudoublepair = this.isDoublePair(this.cardOppositeTemp);
      const playerdoublepair = this.isDoublePair(this.cardInHandTemp);
      if(cpudoublepair && playerdoublepair){
        this.speaker = playerdoublepair > cpudoublepair;
      }else if(cpudoublepair && !playerdoublepair){
        this.speaker = false;
      }else if(!cpudoublepair && playerdoublepair){
        this.speaker = true;
      }else{
        this.step02();
      }
    }

  }

  getCard(){
    const random1 = Math.floor(Math.random() * this.cardStack.length);
    this.cardInHand.push(this.cardStack[random1]);
    this.cardStack.splice(random1, 1);
    const random2 = Math.floor(Math.random() * this.cardStack.length);
    this.cardOpposite.push(this.cardStack[random2]);
    this.cardStack.splice(random2, 1);
  }

  restart() {
    this.init();
    this.over = false;
  }

}

