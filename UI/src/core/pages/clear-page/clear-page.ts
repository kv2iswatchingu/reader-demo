import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';
import { get } from 'sortablejs';
import { DigitalNumber } from '../../components/digital-number/digital-number';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'clear-page',
  imports: [MatIcon, UiButton,DigitalNumber],
  templateUrl: './clear-page.html',
  styleUrl: './clear-page.scss'
})
export class ClearPage {
  //
  arrayLength:number = 14;
  backgroundList: string[] = [];
  charpter:number = 0;

  /**
   * charpter 0  standard / standard   90second
   * charpter 1  left     / next      +60second
   * charpter 2  right    / overdrive +60second
   * charpter 3  down     / oh hell.. +60second
   * charpter 4  up       / ready     +60second
   * charpter 5  center   / next      +60second
   * charpter 6  out      / overdrive +60second
   * charpter 7  standard / finish    +0second
   * 
  */
  emptycell = { x: -1, y: -1, isEdge: true, label: '', clicked: false, showPath: false };

  firstChoose:Cell = this.emptycell;
  secondChoose:Cell = this.emptycell;

  couldClear:boolean = false;
  clearArray:Cell[][]= [];

  noLibaray = true;
  jsonLibarayPath = "";

  charpterOver:boolean = false;
  gameOver:boolean = false;


  timer: number = 0;
  timer_minute: number = 0;
  timer_second: number = 0;
  timerInterval:any;

  waiting:any

  rank: {
    state: string,
    chapter: number,
    date: string,
    score: number,
    combo: number,
    extraTime: string
  }[] = [];

  combo:number = 0;
  score:number = 0;
  constructor(private _snackBar:MatSnackBar) {}

  ngOnInit() {
    if(localStorage.getItem('jsonLibarayPath')){
      this.noLibaray = false;
      this.jsonLibarayPath = localStorage.getItem('jsonLibarayPath')!;
    }else{
      this.noLibaray = true;
    }
    this.getLibarayFromJson();
    if(localStorage.getItem('clearScore')){
      this.rank = JSON.parse(localStorage.getItem('clearScore')!);
    }
    //this.init();
  } 

  ngDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.waiting);
  }

  start(){
    this.charpter = 0
    this.charpterOver = false;
    this.gameOver = false;
    this.firstChoose = this.emptycell;
    this.secondChoose = this.emptycell;
    this.init();
    this.combo = 0;
    this.timer = 90;
    clearInterval(this.timerInterval);
    this.tickTimer();
    
  }
  nextChapter() {
    this.charpter++;
    if (this.charpter === 0) {
      this.timer = 90;
    } else if( this.charpter === 7){
      this.timer += 0;
    }else{
      this.timer += 60;
    }
    this.init();
    this.charpterOver = false;
    this.gameOver = false;
    this.firstChoose = this.emptycell;
    this.secondChoose = this.emptycell;
  }


  resetCharpter() {
    this.init();
    if(this.timer - 60 > 90){
      this.timer -= 90;
      clearInterval(this.timerInterval);
      clearInterval(this.waiting)
      this._snackBar.open('Waiting to reset Chapter',"", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      this.waiting = setTimeout(() => {
        this.nextChapter();
        this.tickTimer();
      },3000);
    }else{
      this.timer = 60;
    }
  }
  afterClear() {
    switch (this.charpter) {
      case 0:
        break;
      case 1:
        this.alignClearArray('left');
        break;
      case 2:
        this.alignClearArray('right');
        break;
      case 3:
        this.alignClearArray('down');
        break;
      case 4:
        this.alignClearArray('up');
        break;
      case 5:
        this.alignClearArray('left');
        this.alignClearArray('up');
        break;
      case 6:
        this.alignClearArray('right');
        this.alignClearArray('down');
        break;
      case 7:
        break;
    }
    if (this.checkChapterClear() && this.charpter < 7) {
      this.charpterOver = true;
      this.score += 10000;
      clearInterval(this.timerInterval);
      clearInterval(this.waiting);
      this.waiting = setTimeout(() => {
        this.nextChapter();
        this.tickTimer();
      },3000);
      this._snackBar.open('Waiting to Next Chapter',"", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }else if( this.charpter === 7 && this.checkChapterClear()){
      this.gameOver = true;
      this._snackBar.open('Win!!',"", {
        duration: 10000,
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      const currentRank = {
        state: 'WIN',
        score: this.score,
        combo: this.combo,
        chapter: this.charpter + 1,
        date: new Date().toLocaleString(),
        extraTime: this.timer_minute + ':' + this.timer_second
      }
      this.rank.push(currentRank);
      localStorage.setItem('clearScore',JSON.stringify(this.rank));
    }
  }
  init(){

    this.clearArray = Array.from({ length: this.arrayLength }, (_,y) =>
      Array.from({ length: this.arrayLength }, (_,x) => ({
        value: 0,
        x: x,
        y: y,
        isEdge: (x === 0 || y === 0 || x === this.arrayLength - 1 || y === this.arrayLength - 1),
        label: '',
        clicked: false,
        showPath: false
      }))
    );
   //console.log(this.clearArray);
    const positions: {x: number, y: number}[] = [];
    for (let y = 1; y < this.arrayLength - 1; y++) {
      for (let x = 1; x < this.arrayLength - 1; x++) {
        positions.push({x, y});
      }
    }
    const X = 15; //
    const total = positions.length;
    let icons: string[] = [];
    let pairCounts = Array(X).fill(0);
    for (let i = 0; i < total / 2; i++) {
      const type = i % X;
      icons.push(this.getIcon(type));
      icons.push(this.getIcon(type));
      pairCounts[type]++;
    }
    // 打乱
    icons = icons.sort(() => Math.random() - 0.5);
    // 2. 填充
    positions.forEach((pos, idx) => {
      this.clearArray[pos.y][pos.x].label = icons[idx];
    });
  }
  async chooseLibaray(){
    //@ts-ignore
    const result = await window.electronAPI.getFile();
    if (result) {
      this.jsonLibarayPath = result;
      localStorage.setItem('jsonLibarayPath',this.jsonLibarayPath);
    }
  }
  async getLibarayFromJson(){
     //@ts-ignore
     const result = await window.electronAPI.readOut(this.jsonLibarayPath);
     if (result.success) {
       const backgroundJson = result.content;
       this.backgroundList = backgroundJson.backgroundList;
       console.log(this.backgroundList);
     }else{
       console.log(result.message);
     }
  } 


  



  clickCell(cell:any){
    if(cell === this.firstChoose){
      this.firstChoose = this.emptycell;
      cell.clicked = false;
      return;
    }
    if(this.gameOver) return;
    if(cell.isEdge) return;
    cell.clicked = true;
    if(!this.isEmpty(this.firstChoose)){

      this.secondChoose = cell
      const pathRight = this.judgePath();
      const isSame = this.firstChoose.label === this.secondChoose.label;

      this.couldClear = pathRight && isSame;

      if(!this.couldClear){
        this.clearArray[this.firstChoose.y][this.firstChoose.x].clicked = false;
        this.clearArray[this.secondChoose.y][this.secondChoose.x].clicked = false;

        this.firstChoose = this.emptycell;
        this.secondChoose = this.emptycell;
        this.combo = 0;

      }else{
        //this.showPath(pathRight.path);
        this.clearArray[this.firstChoose.y][this.firstChoose.x].isEdge = true;
        this.clearArray[this.secondChoose.y][this.secondChoose.x].isEdge = true;
        this.firstChoose = this.emptycell;
        this.secondChoose = this.emptycell;
        const bounds = this.combo < 3 ? Math.floor(this.combo * 0.5) : 3;
        this.timer +=  bounds;
        this.combo++;
        this.score += 200 + this.combo * 5;
        this.afterClear();
      }
    }else{
      this.firstChoose = cell;
    }
  }

  // showPath(path: {x: number, y: number}[]) {
  //   for (const pos of path) {
  //     this.clearArray[pos.y][pos.x].showPath = true;
  //   }
  //   setTimeout(() => {
  //     for (const pos of path) {
  //       this.clearArray[pos.y][pos.x].showPath = false;
  //     }
  //   }, 500);
  // }




  getIcon(num:number){
    switch (num) {
      case 0:
        return 'adjust';
      case 1:
        return 'bedtime';
      case 2:
        return 'brightness_high';
      case 3:
        return 'donut_large';
      case 4:
        return 'euro_symbol';
      case 5:
        return 'explore';
      case 6:
        return 'favorite';
      case 7:
        return 'grade';
      case 8:
        return 'label';
      case 9:
        return 'offline_bolt';
      case 10:
        return 'pan_tool';
      case 11:
        return 'receipt';
      case 12:
        return 'report_problem';
      case 13:
        return 'settings_input_svideo';
      case 14:
        return 'track_changes';
      default:
        return 'adjust';
    }
  }
  isEmpty(cell: Cell) {
    if(cell.label === '') return true;
    if(cell.isEdge) return true;
    if(cell.x === -1 || cell.y === -1) return true;
    return !cell.label;
  }
  isDirectlyConnected(a: Cell, b: Cell, arr: Cell[][]) {
    if (a.y === b.y) {
      const [minX, maxX] = [a.x, b.x].sort((m, n) => m - n);
      for (let x = minX + 1; x < maxX; x++) {
        if (!this.isEmpty(arr[a.y][x])) return false;
      }
      return true;
    }
    if (a.x === b.x) {
      const [minY, maxY] = [a.y, b.y].sort((m, n) => m - n);
      for (let y = minY + 1; y < maxY; y++) {
        if (!this.isEmpty(arr[y][a.x])) return false;
      }
      return true;
    }
    return false;
  }
  isOneTurnConnected(a: Cell, b: Cell, arr: Cell[][]) {
    // 拐点1
    if (
      this.isValid(b.x, a.y) &&
      this.isEmpty(arr[a.y][b.x]) &&
      this.isDirectlyConnected(a, arr[a.y][b.x], arr) &&
      this.isDirectlyConnected(arr[a.y][b.x], b, arr)
    ) {
      return true;
    }
    // 拐点2
    if (
      this.isValid(a.x, b.y) &&
      this.isEmpty(arr[b.y][a.x]) &&
      this.isDirectlyConnected(a, arr[b.y][a.x], arr) &&
      this.isDirectlyConnected(arr[b.y][a.x], b, arr)
    ) {
      return true;
    }
    return false;
  }
  isTwoTurnConnected(a: Cell, b: Cell, arr: Cell[][]) {
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[0].length; x++) {
        if (!this.isEmpty(arr[y][x])) continue;
        const mid = arr[y][x];
        if (
          this.isOneTurnConnected(a, mid, arr) &&
          this.isDirectlyConnected(mid, b, arr)
        ) {
          return true;
        }
        if (
          this.isDirectlyConnected(a, mid, arr) &&
          this.isOneTurnConnected(mid, b, arr)
        ) {
          return true;
        }
      }
    }
    return false;
  }
  isValid(x: number, y: number) {
    return (
      y >= 0 &&
      y < this.clearArray.length &&
      x >= 0 &&
      x < this.clearArray[0].length
    );
  }
  judgePath(){
    if (!this.firstChoose || !this.secondChoose) return false;
    if (this.firstChoose.x === this.secondChoose.x && this.firstChoose.y === this.secondChoose.y) return false;
    if (this.isDirectlyConnected(this.firstChoose, this.secondChoose, this.clearArray)) {
      this.couldClear = true;
      return true;
    }
    if (this.isOneTurnConnected(this.firstChoose, this.secondChoose, this.clearArray)) {
      this.couldClear = true;
      return true;
    }
    if (this.isTwoTurnConnected(this.firstChoose, this.secondChoose, this.clearArray)) {
      this.couldClear = true;
      return true;
    }
    this.couldClear = false;
    return false;
  }
  

  checkChapterClear() {
  // 检查所有非边缘格子是否已清理
  for (let y = 1; y < this.arrayLength - 1; y++) {
    for (let x = 1; x < this.arrayLength - 1; x++) {
      if (!this.clearArray[y][x].isEdge) {
        return false;
      }
    }
  }
  return true;
  }

  

  tickTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.timer_minute = Math.floor(this.timer / 60);
        this.timer_second = this.timer % 60;
      } else {
        clearInterval(this.timerInterval);
        this.gameOver = true;
        this._snackBar.open('TimesUp Game Over',"", {
          duration: 10000,
          horizontalPosition: "center",
          verticalPosition: "top",
        });
        const currentRank = {
          state: 'LOSE',
          score: this.score,
          combo: this.combo,
          chapter: this.charpter + 1,
          date: new Date().toLocaleString(),
          extraTime: this.timer_minute + ':' + this.timer_second
        }
        this.rank.push(currentRank);
        localStorage.setItem('clearScore',JSON.stringify(this.rank));
        }
    }, 1000);
  }

  
  alignClearArray(direction: 'left' | 'right' | 'up' | 'down') {
    if (direction === 'left' || direction === 'right') {
      for (let y = 1; y < this.arrayLength - 1; y++) {
        const row = this.clearArray[y];
        const cells = [];
        for (let x = 1; x < this.arrayLength - 1; x++) {
          if (!row[x].isEdge && row[x].label !== '') {
            cells.push(row[x].label);
          }
        }
        if (direction === 'left') {
          let idx = 1;
          for (let label of cells) {
            row[idx].label = label;
            row[idx].isEdge = false;
            row[idx].clicked = false;
            idx++;
          }
          for (; idx < this.arrayLength - 1; idx++) {
            row[idx].label = '';
            row[idx].isEdge = true;
            row[idx].clicked = false;
          }
        } else if (direction === 'right') {
          let idx = this.arrayLength - 2;
          for (let i = cells.length - 1; i >= 0; i--) {
            row[idx].label = cells[i];
            row[idx].isEdge = false;
            row[idx].clicked = false;
            idx--;
          }
          for (; idx >= 1; idx--) {
            row[idx].label = '';
            row[idx].isEdge = true;
            row[idx].clicked = false;
          }
        }
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let x = 1; x < this.arrayLength - 1; x++) {
        const cells = [];
        for (let y = 1; y < this.arrayLength - 1; y++) {
          if (!this.clearArray[y][x].isEdge && this.clearArray[y][x].label !== '') {
            cells.push(this.clearArray[y][x].label);
          }
        }
        if (direction === 'up') {
          let idx = 1;
          for (let label of cells) {
            this.clearArray[idx][x].label = label;
            this.clearArray[idx][x].isEdge = false;
            this.clearArray[idx][x].clicked = false;
            idx++;
          }
          for (; idx < this.arrayLength - 1; idx++) {
            this.clearArray[idx][x].label = '';
            this.clearArray[idx][x].isEdge = true;
            this.clearArray[idx][x].clicked = false;
          }
        } else if (direction === 'down') {
          let idx = this.arrayLength - 2;
          for (let i = cells.length - 1; i >= 0; i--) {
            this.clearArray[idx][x].label = cells[i];
            this.clearArray[idx][x].isEdge = false;
            this.clearArray[idx][x].clicked = false;
            idx--;
          }
          for (; idx >= 1; idx--) {
            this.clearArray[idx][x].label = '';
            this.clearArray[idx][x].isEdge = true;
            this.clearArray[idx][x].clicked = false;
          }
        }
      }
    }
  }

}


export interface Cell  {
  x: number;
  y: number;
  isEdge: boolean;
  label: string;
  clicked: boolean;
  showPath: boolean;
}