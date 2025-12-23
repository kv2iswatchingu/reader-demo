import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { CommonModule } from '@angular/common';
import { PokerCard, PokerCardType } from '../../components/poker-card/poker-card';
import { UiInput } from '../../components/ui-input/ui-input';

@Component({
  selector: 'testpage',
  templateUrl: 'twentyOne-page.html',
  styleUrl: 'twentyOne-page.scss',
  standalone: true,
  imports: [
    //MatIcon,
    UiButton,
    CommonModule,
    PokerCard
  ],
})
export class TwentyOnePage {

  cardStack: PokerCardType[] = [];
  cardInHand: PokerCardType[] = [];
  cardOpposite: PokerCardType[] = [];

  score: number = 0;
  cpuScore: number = 0;
  message = 'NEXT ROUND';
  winner = '';
  gameover: boolean = false;
  allOver: boolean = false;
  round: number = 0;

  cpuCard:number = 0;
  playerCard:number = 0;
  cpuget:boolean = true;
  playerget:boolean = true;



  ngOnInit() {
    this.globalInit();
  }

  globalInit(){
    this.message = 'NEXT ROUND';
    this.allOver = false;
    this.cpuScore = 0;
    this.score = 0;
    this.initCardStack();
    this.roundInit();
  }

  roundInit(){
    this.gameover = false;
    this.cpuCard = 0;
    this.playerCard = 0;
    this.cpuget = true;
    this.playerget = true;
    this.initCardFirst();
  }

  initCardStack(){
    this.cardStack = [];
    for(let x = 1;  x <= 2; x++){
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
  }
  initCardFirst(){
    if(this.cardStack.length <= 8){
      this.allOver = true;
      this.message = "RESTART";
      return;
    }
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
    
    this.cpuCard = this.checkCard(this.cardOpposite);
    this.playerCard = this.checkCard(this.cardInHand);
    this.checkGameOver();
  }
  checkCard(handCard: PokerCardType[]){
    let total = 0;
    let aceCount = 0;
    handCard.map((item) => {
      if(item.label == 'A'){
        aceCount++;
        total += 11;
      }else if(item.value >= 10){
        total += 10;
      }else{
        total += item.value;
      }
    });
    while(total > 21 && aceCount > 0){
      total -= 10;
      aceCount--;
    }
    return total;
  }
  checkGameOver(){
    if(this.cpuCard === 21 && this.playerCard !== 21){
      this.gameover = true;
      this.winner = "CPU WIN";
      this.cpuScore ++;
    }else if(this.playerCard === 21 && this.cpuCard !== 21){
      this.gameover = true;
      this.winner = "YOU WIN";
      this.score ++;
    }else if( this.cpuCard === 21 && this.playerCard === 21){
      this.gameover = true;
      this.winner = "BOTH WIN";
      this.score ++;
      this.cpuScore ++;
    }else if(this.playerCard > 21 && this.cpuCard < 21){
      this.gameover = true;
      this.winner = "CPU WIN";
      this.cpuScore ++;
    }else if(this.cpuCard > 21 && this.playerCard < 21){
      this.gameover = true;
      this.winner = "YOU WIN";
      this.score ++;
    }else if(this.playerCard > 21 && this.cpuCard > 21){
      this.gameover = true;
      this.winner = "NO WINNER";
    }
    if(this.cpuget == false && this.playerget == false){
      this.gameover = true;
      if(this.cpuCard > this.playerCard){
        this.winner = "CPU WIN";
        this.cpuScore ++;
      }else if (this.cpuCard < this.playerCard){
        this.score ++;
        this.winner = "YOU WIN";
      }else {
        this.winner = "NO WINNER";
      }
    }
  }
  getCard(card: PokerCardType[]){
    const random = Math.floor(Math.random() * this.cardStack.length);
    card.push(this.cardStack[random]);
    this.cardStack.splice(random, 1); 
  }
  playerGetCard(){
    this.getCard(this.cardInHand);
    this.playerCard = this.checkCard(this.cardInHand);
    this.playerget = true;
    this.checkGameOver();
    this.cpuGetCard();
  }
  playerGiveup(){
    this.playerget = false;
    this.checkGameOver();
    this.cpuGetCard();
  }
  cpuGetCard(){
    if(this.gameover || this.allOver){
      return;
    }
    const need = 21 - this.cpuCard;
    let needup = 0;
    this.cardStack.map((item) => {
      if(item.value < 10){
        if(item.value <= need){
          needup ++;
        }
      }else{
        if(10 <= need){
          needup ++;
        }
      }
    })
   if ( needup/this.cardStack.length >= 0.5 ){
    this.getCard(this.cardOpposite);
    this.cpuCard = this.checkCard(this.cardOpposite);
    this.cpuget = true;
   }else{
    this.cpuget = false;
   }
   this.checkGameOver();
  }
  nextRound(){
    this.roundInit();
  }
  restart() {
    this.globalInit();
  }    
}

