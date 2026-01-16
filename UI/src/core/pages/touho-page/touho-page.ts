import { Component } from '@angular/core';
import { DigitalNumber } from '../../components/digital-number/digital-number';

@Component({
  selector: 'app-touho-page',
  imports: [DigitalNumber],
  templateUrl: './touho-page.html',
  styleUrl: './touho-page.scss'
})
export class TouhoPage {
  timer: number = 0;
  timer_minute: number = 0;
  timer_second: number = 0;
  timerInterval:any;

  ngOnInit() {
    this.timerCount();
  }
  //

  timerCount(){
    this.timerInterval = setInterval(() => {
      this.timer ++
      this.timer_minute = Math.floor(this.timer / 60);
      this.timer_second = Math.floor(this.timer % 60);
    }, 1000);
  }

  reset(){
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.timer_minute = 0;
    this.timer_second = 0;
    this.timerCount();
  }

  ngDestroy() {
    clearInterval(this.timerInterval);
  }




  /**
   * Q: 2026^2026 的 末尾四位数字和相加的值是？ 
   * 
   * 2000 + 26 ) ^2026 mod 10000
   * 
   * 
   * [] * [] 
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
}
