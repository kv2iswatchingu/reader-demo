import { Component, Input } from '@angular/core';

@Component({
  selector: 'digital-number',
  imports: [],
  templateUrl: './digital-number.html',
  styleUrl: './digital-number.scss'
})
export class DigitalNumber {
  @Input() id: string = '';
  @Input() number: number = 0;
  @Input() digitalwidth: number = 12;
  @Input() limitedigit: number = 0;
  @Input() digitalcolor: string = '#000000';

  numberArray:number[] = []


  ngOnChanges() {
    this.numberArray = [];
    let num = this.number;
    //let num = 9876543210;
    if( this.limitedigit !== 0){
      // 先将数字拆分到数组
      while (num > 0) {
        this.numberArray.unshift(num % 10);
        num = Math.floor(num / 10);
      }
      // 高位补0
      while (this.numberArray.length < this.limitedigit) {
        this.numberArray.unshift(0);
      }
      // 超出位数只保留低位
      if (this.numberArray.length > this.limitedigit) {
        this.numberArray = this.numberArray.slice(-this.limitedigit);
      }
    }else{
      while (num > 0) {
        this.numberArray.unshift(num % 10);
        num = Math.floor(num / 10);
      }
    }
  }

  ngAfterViewChecked() {
    this.numberArray.forEach((num, position) => {
      this.setDigitalSignal(num, position);
    });
  }

  setDigitalSignal(value: number, position: number) {
    switch (value) {
      case -1:
        this.setDigitalShowNumber([], position);
        break;
      case 0:
        this.setDigitalShowNumber([0,2,3,4,5,6], position);
        break;
      case 1:
        this.setDigitalShowNumber([4,6], position);
        break;
      case 2:
        this.setDigitalShowNumber([0,1,2,4,5], position);
        break;
      case 3:
        this.setDigitalShowNumber([0,1,2,4,6], position);
        break;
      case 4:
        this.setDigitalShowNumber([1,3,4,6], position);
        break;
      case 5:
        this.setDigitalShowNumber([0,1,2,3,6], position);
        break;
      case 6:
        this.setDigitalShowNumber([0,1,2,3,5,6], position);
        break;
      case 7:
        this.setDigitalShowNumber([0,4,6], position);
        break;
      case 8:
        this.setDigitalShowNumber([0,1,2,3,4,5,6], position);
        break;
      case 9:
        this.setDigitalShowNumber([0,1,2,3,4,6], position);
        break;
    }
  }

  setDigitalShowNumber(array:number[], position: number) {
    const digitalEl = document.getElementById('display-' + this.id + position);
    if(digitalEl){
      const digitalElChildren = digitalEl.children;
      for (let index = 0; index < digitalElChildren.length; index++) {
        if(array.includes(index)){
          const signal = digitalElChildren[index] as HTMLElement;
          signal.style.opacity = '1';
        }
      }
    }
  }



//   /**
//    * 
//    *     0        a
//    *   3   4    d   e
//    *     1        b
//    *   5   6    f   g
//    *     2        c
//    */


//[][][][] xy z z colorful
//[]       xz y y colorful 
//         yz x x colorful


}
