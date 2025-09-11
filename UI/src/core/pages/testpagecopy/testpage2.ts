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
import  Sortable  from 'sortablejs';
/**
 * @title Drag&Drop disabled sorting
 */
@Component({
  selector: 'testpage',
  templateUrl: 'testpage2.html',
  styleUrl: 'testpage2.scss',
  standalone: true,
  imports: [ ],
})
export class Test2page {

  list1: number[] = [1,2,3,4,5,6];
  list2: number[] = [7,8,9,10,11,12];
  groupConfig = {
    name: 'shared', // 相同名称的组可以互相拖拽
    pull: true, // 允许拖出
    put: true // 允许拖入
  };
  ngOnInit(){
    const example1 = document.getElementById('example1');
    const example2 = document.getElementById('example2');
    var _this = this;
    const sortble = new Sortable(example1!, {
        animation: 150,
        group: {
          name: 'shared', // 相同名称的组可以互相拖拽
          pull: false, // 允许拖出
          put: true // 允许拖入
        },
        //animation：排序动画持续时间（毫秒），默认值为 0（无动画）
        //delay：延迟开始拖拽的时间（毫秒），默认值为 0
        //delayOnTouchOnly：仅在触摸设备上启用延迟，默认值为 false
        //touchStartThreshold
        /** 
         * mian->
         *  first // tow way method // retunq 1
         * g2
         * 
         * random -> 1 
         *  tak all ? => sss
         *  turn -1 
         *  btn take all
         *  btn turn
         * 
         */
        sort:false,
        //disabled
        //filter



      // 拖拽时预览图样式
        ghostClass: 'blue-background-class',
        // 拖拽时样式
        chosenClass: 'blue-background-class2',
        //ghostClass：拖动时占位元素的 CSS 类名
        //chosenClass：被选中元素的 CSS 类名
        //dragClass：拖拽过程中元素的 CSS 类名
        //handle

        /**
         * onStart：拖拽开始时触发
          onEnd：拖拽结束时触发
          onAdd：元素被添加到列表时触发（用于跨列表拖拽）
          onUpdate：列表内元素位置改变时触发
          onRemove：元素从列表中移除时触发（用于跨列表拖拽）
          onFilter：元素被过滤时触发
          onMove：元素移动时触发
          onChoose：元素被选中时触发
          onUnchoose：元素取消选中时触发
         */
        // onAdd(event) {
        //   const { oldIndex, newIndex } = event;
        //   const item = _this.list2[oldIndex!];
        //   if (newIndex === 0) {
        //     console.log('newIndex',newIndex);
        //     console.log('oldIndex',oldIndex);
        //     _this.list1.unshift(item);
        //   }else{
        //     console.log('newIndex',newIndex);
        //     console.log('oldIndex',oldIndex);
        //     _this.list1.splice(newIndex!,1);
        //     //_this.list2.splice(oldIndex!,0,item);
        //   }
        //   console.log(_this.list1,_this.list2);
        // },
        onAdd: (event) => {
          const { oldIndex, newIndex } = event;
          const item = this.list2.splice(oldIndex!, 1)[0];
          // 只允许插入头或尾
          if (newIndex === 0) {
            this.list1.unshift(item);
          } else if (newIndex === this.list1.length) {
            this.list1.push(item);
          } else {
            // 中间不允许插入，恢复原状
            this.list2.splice(oldIndex!, 0, item);
            // 也可以直接移除 DOM 元素，或用 Sortable 的 revert 方法
            event.from.insertBefore(event.item, event.from.children[oldIndex!]);
          }
          console.log(this.list1, this.list2);
        }
    });
    const sortble2 = new Sortable(example2!, {
        animation: 150,
        group: this.groupConfig,
        sort:false,
        ghostClass: 'blue-background-class',
        chosenClass: 'blue-background-class2',
    })
  }
  
  
}

