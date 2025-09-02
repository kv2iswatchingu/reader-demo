import {Component} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { UICard } from '../../components/ui-card/ui-card';
import { UiButton } from '../../components/ui-button/ui-button';
import { FullCard } from '../../components/full-card/full-card';

/**
 * @title Drag&Drop disabled sorting
 */
@Component({
  selector: 'testpage',
  templateUrl: 'testpage.html',
  styleUrl: 'testpage.scss',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag,UiButton,FullCard],
})
export class Testpage {
  cardStack = [];
  cardInHand = [];
  cardInGrave = [];
  cardHeros = [];
  cardServents = [];




  items = ['Carrots', 'Tomatoes', 'Onions', 'Apples', 'Avocados'];

  basket = ['Oranges', 'Bananas', 'Cucumbers'];

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  //   console.log(this.basket,999);
  // }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // 取出被拖拽的元素
      const [item] = event.previousContainer.data.splice(event.previousIndex, 1);
      // 插入到目标数组最后
      event.container.data.push(item);
    }
    console.log(this.basket, 999);
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<number>) {
    return item.data % 2 === 0;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
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

  //crazy

  event(){
    ////????    
  }

}
