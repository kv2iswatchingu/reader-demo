import { Component, ElementRef, ViewChild } from '@angular/core';
import Sortable from 'sortablejs';
import { EffectTime, EffectType, FunCardTypeExtend } from '../card.interface';
import { FunCard } from '../fun-card/fun-card';

@Component({
  selector: 'app-card-battle',
  imports: [FunCard],
  templateUrl: './card-battle.html',
  styleUrl: './card-battle.scss'
})
export class CardBattle {

  cpuHandCard:FunCardTypeExtend[] = [];
  userHandCard:FunCardTypeExtend[] = [];

  cpuCard:FunCardTypeExtend[] = [];
  userCard:FunCardTypeExtend[] = [];

  cpuUsedCard:FunCardTypeExtend[] = [];
  userUsedCard:FunCardTypeExtend[] = [];

  //@ViewChild('cpuOn') cpuOn: ElementRef | undefined;
  cpuOnCard: FunCardTypeExtend[] = [
    {
      id:"test-1",
      name:"test-1",
      cost:2,
      orginCost:2,
      description:"test-1",
      imageList:{
        normalImage:"./card-test/test-normal.png",
        changeImage:"./card-test/test-change.png",
      },
      atk:1,
      originAtk:1,
      def:4,
      originDef:4,
      showDetail:false
    },
    {
      id:"test-3",
      name:"test-3",
      cost:3,
      orginCost:3,
      description:"test-3",
      imageList:{
        normalImage:"./card-test/test-normal.png",
        changeImage:"./card-test/test-change.png",
      },
      atk:3,
      def:2,
      originAtk:3,
      originDef:2,
      showDetail:false
    }
  ];
  userOnCard: FunCardTypeExtend[] = [
    {
      id:"test-2",
      name:"test-2",
      cost:2,
      orginCost:2,
      description:"test-2",
      imageList:{
        normalImage:"./card-test/test-normal.png",
        changeImage:"./card-test/test-change.png",
      },
      atk:3,
      originAtk:3,
      def:16,
      originDef:16,
      canAttack:true,
      showDetail:false
    }
  ];
  sortbaleUser: Sortable | undefined;
  sortableCpu: Sortable | undefined;
  @ViewChild('usercard') usercardRef?: ElementRef<HTMLDivElement>;
  @ViewChild('cpucard') cpucardRef?: ElementRef<HTMLDivElement>;


  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   *    
   */

  ngAfterViewInit(){
    if(this.usercardRef){
      this.sortbaleUser = new Sortable(this.usercardRef.nativeElement, {
        group: 'card',
        animation: 150,
        ghostClass: 'ghost',
        onAdd: (event) => {
          console.log(event);

        }
      });
    }
    /**
     * franement(){
     *   const data= event.item.dataset;
     *   const data2 = event.oldIndex
     *   console.log(data,data2);
     * }
     */
    if(this.cpucardRef){
      this.sortableCpu = new Sortable(this.cpucardRef.nativeElement, {
        group: 'card',
        animation: 150,
        ghostClass: 'ghost',
        onAdd: (event) => {
          //override
          const data= event.item.dataset;
          const data2 = event.oldIndex
          console.log(data,data2);
          //
          /**
           * revange!? revange!
           * I will show you what is a revange
           * 
           * 
           * 
           * 
           * 
           * 
           * 
           */
        }
      });
    }
  }

  areaCard:FunCardTypeExtend | null = null
  state:any = null;
  

  cpuCost = 1;
  userCost = 1;
  // 

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
     * we abye to 
     * wssss.
     * //
     * // 
    
     * //
     * //
     * // U   U
     * //   ^
     * ffcosnt = eff
     * >= prefe.
     * 2>L =a
     * pradise's lust
     * oh hell,welcome to my 
     * do what you want
     * tonight 
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

  cardin(){
    console.log(this.cpuOnCard);
    console.log(this.userOnCard);
    this.areaCard = null;

  }

  //
  attackFrom(target:FunCardTypeExtend,self:FunCardTypeExtend){
    target.def = target.def - self.atk;
    self.def = self.def - target.atk;
    self.canAttack = false;
    this.destory(target,this.cpuOnCard);
    this.destory(self,this.userOnCard);
  }

  destory(card:FunCardTypeExtend,cardList:FunCardTypeExtend[]){
    if(card.def <= 0){
      cardList.splice(cardList.indexOf(card),1);
    }
  }
  
  
  // save(){
  //   localStorage.setItem('userOnCard',JSON.stringify(this.userOnCard));
  //   localStorage.setItem('cpuOnCard',JSON.stringify(this.cpuOnCard));
  //   localStorage.setItem('userCost',this.userCost.toString());
  //   localStorage.setItem('cpuCost',this.cpuCost.toString());
  // }
  
  
  nextTurn(){'l/.km'
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


  //Status - Change 
  observeEffect(card:FunCardTypeExtend,Status:string){
    card.effect?.map(effect => {
      switch(effect.effectTime){
        case EffectTime.Enter:
          switch(effect.effectType){
            
          }
          break;
        case EffectTime.Leave:
          switch(effect.effectType){
          
          }
          break;
        case EffectTime.Begin:
          switch(effect.effectType){
          
          }
          break;
        case EffectTime.End:
          switch(effect.effectType){
          
          }
          break;
        default:
          switch(effect.effectType){
          
          }
          break;
        
      }
    })
  }


  //Effect
  switchEffectType(effectType:EffectType){
    switch(effectType){
      
    }
  }
  


}

