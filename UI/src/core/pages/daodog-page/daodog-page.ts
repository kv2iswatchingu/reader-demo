import { Component } from '@angular/core';

@Component({
  selector: 'app-daodog-page',
  imports: [],
  templateUrl: './daodog-page.html',
  styleUrl: './daodog-page.scss'
})
export class DaodogPage {
  // programmUse
  pressAnyBtnToStart:boolean = true;


  date:number = 0
  timeStatus:number = 0;
  // gameInfo\


  /**
   * 3 21 2 3 4 32
   * eeeeeeeeoieeeieeefeccecccccccccccccc
   * // -ghgu
   * 
   * 
   * 
   *  */
  marketCore(){
    //FRESH JSON 
  }


  changePlace(place:string){
    this.changeTime();
  }
  changeTime(){
    this.timeStatus += 1
  }
  changeDate(){
    this.date += 1
  }



}
