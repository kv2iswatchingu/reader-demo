import {Component} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FullCard, FullCardType } from '../../components/full-card/full-card';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * @title Drag&Drop disabled sorting
 */
@Component({
  selector: 'testpage',
  templateUrl: 'testpage.html',
  styleUrl: 'testpage.scss',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, FullCard, CdkDrag, UiButton,MatIcon,CommonModule],
})
export class Testpage {

  cardStack:FullCardType[] = [];
  cardInHand:FullCardType[] = [];
  cardOpposite:FullCardType[] = [];
  cardDesk:FullCardType[] = [];

  score:number = 0;
  cpuScore:number = 0;

  constructor() {}

  ngOnInit() {
    this.generateAll();
     //this.coreMethod(5,10);
     console.log(this.cardDesk)
  }

  // ngOnChanges(){
  // }

  drop(event: CdkDragDrop<FullCardType[]>) {
    console.log(event.currentIndex , event.container.data.length)
    if (event.currentIndex === 0) {
      const target = event.container.data[event.currentIndex];
      const current = event.previousContainer.data[event.previousIndex];
      
      if(  target.value + 1 == current.value 
        || target.value - 1 == current.value 
        || ( target.value == 13 && current.value == 1 )
        || ( target.value == 1 && current.value == 13 )
      ){
        const [item] = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.unshift(item);
        this.coreMethod();
      } 
    } else if (event.currentIndex === event.container.data.length) {
      const target = event.container.data[event.currentIndex - 1];
      const current = event.previousContainer.data[event.previousIndex];
      if(  target.value + 1 == current.value 
        || target.value - 1 == current.value 
        || ( target.value == 13 && current.value == 1 )
        || ( target.value == 1 && current.value == 13 )
      ){
        const [item] = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.push(item);
        this.coreMethod();
      }
    }
    this.checkEmpty();
  }

  netxMethod(){
    this.getCardMethod(this.cardInHand);
    this.coreMethod();
  }
  
  testMethod(current:any,target:any){
    console.log('cardDestory',current,target);
    if(current.type == ''){
      //
      const a = target.map((item:any)=>{
        item.type = current.type
      })
    }else{

    }

  }

  generateAll(){
    this.cardInHand = [];
    this.cardOpposite = [];
    this.cardStack = [];
    this.cardDesk = [];

    for(let j = 1; j <=4 ; j ++ ){
      for(let i = 1; i <= 13; i ++ ){
        const item:FullCardType = {
          label: i == 13 ? 'K' : i == 12 ? 'Q' : i == 11 ? 'J' : i == 1 ? 'A' : i.toString(),
          value: i,
          type: j == 1 ? 'bookmark' : j == 2 ? 'change_history' : j == 3 ? 'copyright' : 'label_important',
        }
        this.cardStack.push(item);
      }
    }

    for(let r = 0; r < 2; r ++){
      const random = Math.floor(Math.random() * this.cardStack.length);
      this.cardDesk.push(this.cardStack[random]);
      this.cardStack.splice(random,1);
    }

    for(let index = 0; index < 6; index ++){
      const random = Math.floor(Math.random() * this.cardStack.length);
      this.cardInHand.push(this.cardStack[random]);
      this.cardStack.splice(random,1);
    }

    for(let jndex = 0; jndex < 6; jndex ++){
      const random = Math.floor(Math.random() * this.cardStack.length);
      this.cardOpposite.push(this.cardStack[random]);
      this.cardStack.splice(random,1);
    }

    console.log(this.cardStack, this.cardInHand, this.cardOpposite, this.cardDesk);
  }

  coreMethod(){
    const start = this.cardDesk[0].value;
    const end = this.cardDesk[this.cardDesk.length - 1].value;    
    const left_1 = this.cardOpposite.findIndex((item:any) =>  item.value == start + 1 );
    const left_2 = this.cardOpposite.findIndex((item:any) =>  item.value == start - 1 );
    const right_1 = this.cardOpposite.findIndex((item:any) =>  item.value == end + 1 );
    const right_2 = this.cardOpposite.findIndex((item:any) =>  item.value == end - 1 );

    if( left_1 != -1 ){
      this.cardDesk.unshift(this.cardOpposite[left_1]);
      this.cardOpposite.splice(left_1,1);
    }else if( left_2 != -1 ){
      this.cardDesk.unshift(this.cardOpposite[left_2]);
      this.cardOpposite.splice(left_2,1);
    }else if( right_1 != -1 ){
      this.cardDesk.push(this.cardOpposite[right_1]);
      this.cardOpposite.splice(right_1,1);
    }else if( right_2 != -1 ){
      this.cardDesk.push(this.cardOpposite[right_2]);
      this.cardOpposite.splice(right_2,1);
    }else if( start == 1 || end == 1 ){
      const usefulK = this.cardDesk.findIndex((item:any) => item.value == 13);
      if(usefulK != -1){
        if(start == 1){
          this.cardDesk.unshift(this.cardOpposite[usefulK]);
          this.cardOpposite.splice(usefulK,1);
        }
        if(end == 1){
          this.cardDesk.push(this.cardOpposite[usefulK]);
          this.cardOpposite.splice(usefulK,1);
        }
      }
    }else if( start == 13 || end == 13 ){
      const usefulA = this.cardDesk.findIndex((item:any) => item.value == 1);
      if(usefulA != -1){
        if(start == 13){
          this.cardDesk.unshift(this.cardOpposite[usefulA]);
          this.cardOpposite.splice(usefulA,1);
        }
        if(end == 13){
          this.cardDesk.push(this.cardOpposite[usefulA]);
          this.cardOpposite.splice(usefulA,1);
        }
      }
    }else{
      this.getCardMethod(this.cardOpposite);
      console.log(this.cardOpposite,"3qqqqq");
    }
    this.checkEmpty();
  }

  getCardMethod(array:FullCardType[]){
    const random = Math.floor(Math.random() * this.cardStack.length);
    array.push(this.cardStack[random]);
    this.cardStack.splice(random,1);
    this.checkEmpty();
  }

  checkEmpty(){
    if (this.cardStack.length === 0) {
      if(this.cardInHand.length > this.cardOpposite.length){
        this.cpuScore += 1
        this.generateAll();
      }else{
        this.score += 1
        this.generateAll();
      }
    }
    if (this.cardInHand.length === 0) {
      this.score += 1
      this.generateAll();
    }
    if (this.cardOpposite.length === 0) {
      this.cpuScore += 1
      this.generateAll();
    }
  }



}

