import { Component } from '@angular/core';

@Component({
  selector: 'app-guess-number',
  imports: [],
  templateUrl: './guess-number.html',
  styleUrl: './guess-number.scss'
})
export class GuessNumber {

  constructor(){

  }

  minNumber:number = 0;
  maxNumber:number = 1000;

  guessNumber:number = 0;
  guessMessage:string = '';
  guessCount:number = 1;
  gameover:boolean = false;

  ngOnInit() {
  
  }


  start(){
    this.guessNumber = this.ramdomNumber();
    this.guessCount = 1;

  }

  guess(number:number){
    if(number == this.guessNumber){
      this.guessMessage = '恭喜你猜中了';
      this.gameover = true;
    }else{
      if(number > this.guessNumber){
        this.guessMessage = '猜大了';
        this.guessCount ++;
      }else{
        this.guessMessage = '猜小了';
        this.guessCount ++;
      }
    }
  }

  ramdomNumber(){
    return Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1) + this.minNumber);   
  }
}

