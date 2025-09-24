import {Component} from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';
import  Sortable  from 'sortablejs';
/**
 * @title Drag&Drop disabled sorting
 */
@Component({
  selector: 'mathtable-page',
  templateUrl: 'mathtable-page.html',
  styleUrl: 'mathtable-page.scss',
  standalone: true,
  imports: [UiButton,MatIcon],
})
export class MathTablePage {
  questionArray = Array.from({ length: 9 }, () => Array(9).fill(0));
  answerArray = Array.from({ length: 9 }, () => Array(9).fill(0));
  showArray = Array.from({ length: 9 }, () => Array(9).fill(0));
  sortbaleArray: Sortable[] = [];
  numberstoreSortable: Sortable | null = null;
  rubbishSortable: Sortable | null = null;
  initFlag: boolean = false;
  hintFlag: number = 0;
  score: string = 'none';
  rank: {
    date: string,
    difficulty: number,
    score: string
  }[] = [];
  timer: number = 0;
  timer_minute: number = 0;
  timer_second: number = 0;
  timerInterval:any;
  difficulty: number  = 0;
  oldmarki: number = 0;
  oldmarkj: number = 0;
  ngOnInit() {
    if(localStorage.getItem('mathhidoriScore')){
      this.rank = JSON.parse(localStorage.getItem('mathhidoriScore')!);
    }
  }
  init(){
    this.initFlag = true;
    const initArray = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fill(initArray);
    this.answerArray = initArray.map((item) => [...item]);
    this.showArray = this.hideNumbers(initArray);
    this.questionArray = this.showArray.map((item) => [...item]);
    //console.log(this.questionArray,this.answerArray,this.showArray);
  }
  domInit(){
    let noMathcell: number[] = []
    for (let i = 0; i < this.questionArray.length; i++) {
      for (let j = 0; j < this.questionArray[i].length; j++) {
        if (this.questionArray[i][j] !== 0) {
          noMathcell.push( i*9+j+1 );
        }
      }
    }
    for(let i = 1 ; i < 82 ; i++ ){
      if(noMathcell.includes(i) == false){
        const sortable = new Sortable(document.getElementById(`mathcell${i}`)!, {
          animation: 150,
          group: {
            name: 'mathhidori',
            pull: true,
            put:(to,from,dragE)=>{
              return to.el.children.length === 0;
            }
          },
          onAdd: (event) => {
            const position = this.getIJFromId(event.to.id);
            const number = (Number)(event.item.innerText);
            if(!this.checkOut(this.showArray, position!.i, position!.j, number)){
              event.item.style.background = "red";
            }else{
              event.item.style.background = "#bbd8e2";
            }
            this.showArray[position!.i][position!.j]= number;
            //console.log(this.showArray,9999);
            this.checkAuto();
          },
          onMove: (event) => {
            const position = this.getIJFromId(event.from.id);
            this.showArray[position!.i][position!.j]= 0;
            //console.log(this.showArray,11111);
          },
          sort:false,
          chosenClass: 'mathtable-chosen-class',
        })
        this.sortbaleArray.push(sortable);
      }
    }
    this.numberstoreSortable = new Sortable(document.getElementById('numberstorage')!, {
      animation: 150,
      group: {
        name: 'mathhidori',
        pull: 'clone',
        put: false
      },
      sort:false,
      chosenClass: 'mathtable-chosen-class',
    })
    this.rubbishSortable = new Sortable(document.getElementById('rubbish')!, {
      animation: 150,
      group: {
        name: 'mathhidori',
        pull: false
      },
      onAdd: (event) => {
        //console.log(event.item);
        const { oldIndex, newIndex } = event;
        //event.from.insertBefore(event.item, event.from.children[oldIndex!]);
        event.to.removeChild(event.item);
      },
      chosenClass: 'mathtable-chosen-class',
    })
  }
  fill(array: number[][]) {
    let isEmpty = false;
    let i, j = 0;
    for (i = 0; i < 9; i++) {
      for (j = 0; j < 9; j++) { 
        if (array[i][j] === 0) {
          isEmpty = true;
          break; //打断了循环
        }
      }
      if (isEmpty) break;
    }
    if (!isEmpty) {
      //fullNumber 完成 直接退出
      return true;
    }
    for (let index = 1; index <= 9; index++) {
      const number = Math.floor(Math.random() * 9) + 1;
      if (this.checkOut(array, i, j, number)) {
        array[i][j] = number;
        if (this.fill(array)) {
          return true; // 递归调用，尝试填充下一个位置
        }
        array[i][j] = 0; // 回溯，清除数字
      }
    }
    return false; 
  }
  checkOut(array: number[][], row: number, col: number, number: number) {
    // 检查行
    for (let n = 0; n < 9; n++) {
      if (array[row][n] === number) {
        return false;
      }
    }
    // 检查列
    for (let n = 0; n < 9; n++) {
      if (array[n][col] === number) {
        return false;
      }
    }
    // 检查3x3子网格
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (array[i][j] === number) {
          return false;
        }
      }
    }

    return true;
  };
  hideNumbers(array: number[][]){
    let puzzle = array.map((row) => [...row]);
    let cells = [];
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) cells.push([i, j]);
    for (let i = cells.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[r]] = [cells[r], cells[i]];
    }
    let removed = 0;
    let idx = 0;
    while (removed < 81 && idx < cells.length) {
      const [i, j] = cells[idx];
      const backup = puzzle[i][j];
      puzzle[i][j] = 0;
      // 判断唯一解
      if (this.solutionToOne(puzzle) !== 1) {
        puzzle[i][j] = backup; // 恢复
      } else {
        removed++;
        
      }
      idx++;
    }
    this.difficulty = 81 - removed;
    return puzzle;
  };
  solutionToOne(fullarray: number[][]) {
    let count = 0;
    const solve = (array: number[][]) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (array[i][j] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.checkOut(array, i, j, num)) {
                array[i][j] = num;
                solve(array);
                array[i][j] = 0;
              }
            }
            return;
          }
        }
      }
      count++;
      if (count > 1) return;
    };
    const arrCopy = fullarray.map((row) => [...row]);
    solve(arrCopy);
    return count;
  };
  getIJFromId(id: string): {i: number, j: number} | null {
    const match = id.match(/^mathcell(\d+)$/);
    if (!match) return null;
    const n = parseInt(match[1], 10);
    const i = Math.floor((n - 1) / 9);
    const j = (n - 1) % 9;
    return { i, j };
  }
  start(){
    this.init();
    this.domInit();
    this.timerCount();
  }
  restart() {
    this.sortbaleArray.map((item) => {
      if(item.el.childNodes.length !== 0){
        item.el.removeChild(item.el.childNodes[0]);
      }
      item.destroy();
    });
    this.numberstoreSortable!.destroy();
    this.rubbishSortable!.destroy();
    this.sortbaleArray = [];
    this.hintFlag = 0;

    this.init();
    this.domInit();
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.timerCount();
  }
  hint(){
    this.hintFlag ++;
    for( let i = 0; i < 9 ; i++){
      for( let j = 0; j < 9 ; j++){
        if(this.showArray[i][j] !== 0){
          if(this.answerArray[i][j] !== this.showArray[i][j]){
            const el = document.getElementById(`mathcell${i*9+j+1}`);
            if(el){
              if(el.children.length !== 0){
                const item  = el.children[0] as HTMLElement;
                item.style.background = "red";
              }
            }
          }
        }
      }
    }
    // const inputs = document.querySelectorAll("input");
      
      // inputs.forEach((input, idx) => {
      //   const row = Math.floor(idx / 9);
      //   const col = idx % 9;
      //   if (
      //     !askArray[row][col] && // 不是初始数字
      //     showArray[row][col] !== 0 &&
      //     showArray[row][col] === answerArray[row][col]
      //   ) {
      //     input.style.backgroundColor = "lightgreen";
      //   } else if (!askArray[row][col]) {
      //     input.style.backgroundColor = "white";
      //   }
      // });
    
  }
  markable(i:number,j:number){
    if( this.oldmarki == i && this.oldmarkj == j){
      for(let x = 0; x < 9; x++){
        const cellRef = document.getElementById(`mathcell${ x * 9 + j + 1 }`);
        if(cellRef){
          cellRef.style.background = "transparent";
        }
      }
      for(let y = 0; y < 9; y++){
        const cellRef = document.getElementById(`mathcell${ i * 9 + y + 1 }`);
        if(cellRef){
          cellRef.style.background = "transparent";
        }
      }
    }else{
      for(let i = 1 ; i < 82 ; i++ ){
        const cellRef = document.getElementById(`mathcell${ i }`);
        if(cellRef){
          cellRef.style.background = "transparent";
        }
      }
      for(let x = 0; x < 9; x++){
        const cellRef = document.getElementById(`mathcell${ x * 9 + j + 1 }`);
        if(cellRef){
          cellRef.style.background = "#88224422";
          this.oldmarki = i;
        }
      }
      for(let y = 0; y < 9; y++){
        const cellRef = document.getElementById(`mathcell${ i * 9 + y + 1 }`);
        if(cellRef){
          cellRef.style.background = "#88224422";
          this.oldmarkj = j;
        }
      }
    }
    
  }
  timerCount(){
    this.timerInterval = setInterval(() => {
      this.timer ++;
      //console.log(this.timer);
      this.timer_minute = Math.floor(this.timer / 60);
      this.timer_second = Math.floor(this.timer % 60);
      if( this.timer > 3000){
        clearInterval(this.timerInterval);
        this.getScore();
      }
    }, 1000);
  }
  checkAuto(){
    if( JSON.stringify(this.showArray) === JSON.stringify(this.answerArray) ){
      clearInterval(this.timerInterval);
      this.getScore();
    }
  }
  getScore(){
    switch(true){
      case this.timer <= 300 && this.timer > 0:
        this.score = "S";break;
      case this.timer > 300 && this.timer <= 600:
        this.score = "A";break;
      case this.timer > 600 && this.timer <= 900:
        this.score = "B";break;
      case this.timer > 900 && this.timer <= 1200:
        this.score = "C";break;
      case this.timer > 1200 && this.timer <= 3000:
        this.score = "D";break;
      default:
        this.score = "Failed";
    }
    const rank1 = {
      score: this.score,
      difficulty: this.difficulty,
      date: new Date().toLocaleString(),
    }
    this.rank.push(rank1);
    localStorage.setItem('mathhidoriScore',JSON.stringify(this.rank));
  }
  ngDestroy(){
    clearInterval(this.timerInterval);
  }
}



 /**
   *  x + 1 x x-1 / xxx  + xx 
   *  weight - ?
   * river ? weight ?
   * foreach hand weight ?
   * x without x+1 x-1  -> 19zf tag->older 
   * ?
   * calc. bug
   * 8.32
   * Baccano
   * C3
   * []|[]
   * []|[]
   * 39 Music
   * 
   * 
   * 
   * 
   */
  // const example1 = document.getElementById('example1');
    // const example2 = document.getElementById('example2');
      //- AAAAAnarcy
    // var _this = this;
    // const sortble = new Sortable(example1!, {
    //     animation: 150,
    //     group: {
    //       name: 'shared', // 相同名称的组可以互相拖拽
    //       pull: false, // 允许拖出
    //       put: true // 允许拖入
    //     },
    //     //animation：排序动画持续时间（毫秒），默认值为 0（无动画）
    //     //delay：延迟开始拖拽的时间（毫秒），默认值为 0
    //     //delayOnTouchOnly：仅在触摸设备上启用延迟，默认值为 false
    //     //touchStartThreshold
    //     /** 
    //      * mian->
    //      *  first // tow way method // retunq 1
    //      *  g2
    //      * 
    //      *  random -> 1 
    //      *  tak all ? => sss
    //      *  turn -1 
    //      *  btn take all
    //      *  btn turn
    //      *  btn random
    //      *  <=|[]|= <
    //      */
    //     sort:false,
    //     //disabled
    //     //filter



    //   // 拖拽时预览图样式
    //     ghostClass: 'mathtable-chosen-class',
    //     // 拖拽时样式
    //     chosenClass: 'mathtable-chosen-class2',
    //     //ghostClass：拖动时占位元素的 CSS 类名
    //     //chosenClass：被选中元素的 CSS 类名
    //     //dragClass：拖拽过程中元素的 CSS 类名
    //     //handle

    //     /**
    //      * onStart：拖拽开始时触发
    //       onEnd：拖拽结束时触发
    //       onAdd：元素被添加到列表时触发（用于跨列表拖拽）
    //       onUpdate：列表内元素位置改变时触发
    //       onRemove：元素从列表中移除时触发（用于跨列表拖拽）
    //       onFilter：元素被过滤时触发
    //       onMove：元素移动时触发
    //       onChoose：元素被选中时触发
    //       onUnchoose：元素取消选中时触发
    //      */
    //     // onAdd(event) {
    //     //   const { oldIndex, newIndex } = event;
    //     //   const item = _this.list2[oldIndex!];
    //     //   if (newIndex === 0) {
    //     //     console.log('newIndex',newIndex);
    //     //     console.log('oldIndex',oldIndex);
    //     //     _this.list1.unshift(item);
    //     //   }else{
    //     //     console.log('newIndex',newIndex);
    //     //     console.log('oldIndex',oldIndex);
    //     //     _this.list1.splice(newIndex!,1);
    //     //     //_this.list2.splice(oldIndex!,0,item);
    //     //   }
    //     //   console.log(_this.list1,_this.list2);
    //     // },
    //     onAdd: (event) => {
    //       const { oldIndex, newIndex } = event;
    //       const item = this.list2.splice(oldIndex!, 1)[0];
    //       // 只允许插入头或尾
    //       if (newIndex === 0) {
    //         this.list1.unshift(item);
    //       } else if (newIndex === this.list1.length) {
    //         this.list1.push(item);
    //       } else {
    //         // 中间不允许插入，恢复原状
    //         this.list2.splice(oldIndex!, 0, item);
    //         // 也可以直接移除 DOM 元素，或用 Sortable 的 revert 方法
    //         event.from.insertBefore(event.item, event.from.children[oldIndex!]);
    //       }
    //       console.log(this.list1, this.list2);
    //     }
    // const example3 = document.getElementById('example3');
    // const sortble3 = new Sortable(example3!, {
    //     animation: 150,
    //     group: this.groupConfig,
    //     sort:false,
    //     ghostClass: 'mathtable-chosen-class',
    //     chosenClass: 'mathtable-chosen-class2',
    // })
    // const example4 = document.getElementById('example4');
    // const sortble4 = new Sortable(example4!, {
    //     animation: 150,
    //     group: this.groupConfig,
    //     sort:false,
    //     ghostClass: 'mathtable-chosen-class',
    //     chosenClass: 'mathtable-chosen-class2',
    // })
    // });