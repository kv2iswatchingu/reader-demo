import { Component, ElementRef, ViewChild } from '@angular/core';
import { FunCard, FunCardType } from '../../components/fun-card/fun-card';

@Component({
  selector: 'app-card-page',
  imports: [FunCard],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss'
})
export class CardPage {


  //@ViewChild('cpuOn') cpuOn: ElementRef | undefined;
  cpuOnCard: FunCardTypeExtend[] = [
    {
      id:"test-1",
      name:"test-1",
      cost:2,
      description:"test-1",
      atk:1,
      def:4,
      showDetail:false
    },
    {
      id:"test-3",
      name:"test-3",
      cost:3,
      description:"test-3",
      atk:3,
      def:2,
      showDetail:false
    }
  ];
  userOnCard: FunCardTypeExtend[] = [
    {
      id:"test-2",
      name:"test-2",
      cost:2,
      description:"test-2",
      atk:3,
      def:16,
      canAttack:true,
      showDetail:false
    }
  ];


  state:any = null;
  
  aera = '';

  cpuCost = 1;
  userCost = 1;
  

  waitingForTarget = false;


  showDetail(usercard:FunCardTypeExtend){
    usercard.showDetail = !usercard.showDetail;   
  }

  //使用自己可点击的目标时？
  attack(event:MouseEvent,self:FunCardTypeExtend){
    if( self.canAttack == false){ return }
    self.showDetail = false;
    this.waitingForTarget = !this.waitingForTarget;

    //限制了等待点击的对象
    const cpucards = document.getElementsByClassName('cpuCard');
    //switch(0)

    const handler = (e: MouseEvent) => {
      console.log("attack",self);
      if (!this.waitingForTarget) return;
      this.waitingForTarget = false;
      //====|________/
      
      Array.from(cpucards).forEach((card:any) => {
         card.style.border = 'none';
        card.removeEventListener('click', handler, true);
      })

      //removeEventListener('click', handler, true);
      // 这里继续你的事件逻辑
      // e.target 就是用户点击的目标
      this.handleTargetClick(e.target,self);
    };
    
    
    /**
     * 
     * wssss.///////////////
     * ffcosnt = eff
     * >= prefe.
     * 2>L =a
     * 
    */
    Array.from(cpucards).forEach((card:any) => {
      card.style.border = '1px solid red';
      card.addEventListener('click', handler, true);
      //.wsliver
      
    })
    //.addEventListener('click', handler, true);
    event.stopPropagation(); // 阻止本次点击冒泡
  }

  //选择对面的情况
  handleTargetClick(target: EventTarget | null,self:FunCardTypeExtend) {
    // 你的后续逻辑
    console.log('目标点击:', target);
    // 找到最近的带 data-id 的元素
    let el = target as HTMLElement | null;
    while (el && !el.getAttribute('data-id')) {
      el = el.parentElement;
    }
    const id = el?.getAttribute('data-id');
    if (id) {
      // 在数组里查找
      const card = this.cpuOnCard.find(c => c.id === id);
      console.log('目标卡片数据:', card);
      console.log('原始卡片数据:', self);
      // 这里可以继续你的逻辑
      this.attackFrom(card!,self);  
    } else {
      console.log('未找到目标卡片');
    }
  }

  //
  attackFrom(target:FunCardType,self:FunCardTypeExtend){
    target.def = target.def - self.atk;
    self.def = self.def - target.atk;
    self.canAttack = false;
    this.destory(target,this.cpuOnCard);
    this.destory(self,this.userOnCard);
  }

  destory(card:FunCardType,cardList:FunCardType[]){
    if(card.def <= 0){
      cardList.splice(cardList.indexOf(card),1);
    }
  }


  nextTurn(){
    this.cpuCost ++;
    this.cpuMethod();
  }

  cpuMethod(){
    //do nothing but
    this.cpuEndTurn();
  }

  cpuEndTurn(){
    this.userCost ++;
    this.userOnCard.forEach(card => card.canAttack = true);
  }
}

export interface FunCardTypeExtend extends FunCardType{
  canAttack?:boolean;
  showDetail?:boolean;

  //.....
}