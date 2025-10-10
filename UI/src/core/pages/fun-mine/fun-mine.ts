import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DigitalNumber } from '../../components/digital-number/digital-number';

@Component({
  selector: 'app-fun-mine',
  imports: [UiButton, MatIcon,CommonModule,DigitalNumber],
  templateUrl: './fun-mine.html',
  styleUrl: './fun-mine.scss',
})
export class FunMine {
  
  currentLevel = {
    name: 'easy',
    width: 9,
    height: 9,
    mineCount: 10,
  };
  easyLevel = {
    name: 'easy',
    width: 9,
    height: 9,
    mineCount: 10, // 10/81 .13
  };
  normalLevel = {
    name: 'normal',
    width: 16,
    height: 16,
    mineCount: 40,// 40/196 = .204
  };
  hardLevel = {
    name: 'hard',
    width: 30,
    height: 16,
    mineCount: 99, // 99/480 .2
  };
  erhabenLevel = {
    name: 'erhaben',
    width: 30,
    height: 20,
    mineCount: 168,  // 168/600 .28
  }
  
  mineArray: Mine[][] = [];
  over: boolean = false;

  faceState: 'neutral' | 'surprise' | 'win' | 'lose' = 'neutral';

  currentMine: number = 0;

  timer: number = 0;
  timer_minute: number = 0;
  timer_second: number = 0;
  timerInterval:any;

  rank: {
    date: string,
    difficulty: string,
    score: string
  }[] = [];
  
  ngOnInit() {
    this.mineArray = this.init();
    if(localStorage.getItem('mineScore')){
      this.rank = JSON.parse(localStorage.getItem('mineScore')!);
    }
  }

  ngDestroy(){
    clearInterval(this.timerInterval);
  }

  init() {
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.timerCount();
    this.over = false;
    this.faceState = 'neutral';
    this.currentMine = this.currentLevel.mineCount;
    document.documentElement.style.setProperty('--mine-rows', this.currentLevel.height + '');
    document.documentElement.style.setProperty('--mine-cols', this.currentLevel.width + '');
    const array = Array.from({ length: this.currentLevel.height }, () =>
      Array.from({ length: this.currentLevel.width }, () => ({
        value: 0,
        clicked: false,
        marked: false,
        isZero: false,
        isMine: false,
      }))
    );
    let mines = 0;
    while (mines < this.currentLevel.mineCount) {
      const mineRow = Math.floor(Math.random() * this.currentLevel.height);
      const mineCol = Math.floor(Math.random() * this.currentLevel.width);
      if (array[mineRow][mineCol].isMine === false) {
        array[mineRow][mineCol].isMine = true;
        array[mineRow][mineCol].value = 99;
        mines++;
      }
    }
    for (let index = 0; index < this.currentLevel.height; index++) {
      for (let jndex = 0; jndex < this.currentLevel.width; jndex++) {
        if (array[index][jndex].isMine === true) continue;
        let count = 0;

        for (let deltaRow = -1; deltaRow <=1 ; deltaRow++) {
          for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
            if (deltaCol === 0 && deltaRow === 0) continue;
            const nextRow = index + deltaRow, nextCol = jndex + deltaCol;
            if (
              nextRow >= 0 &&
              nextRow < this.currentLevel.height &&
              nextCol >= 0 &&
              nextCol < this.currentLevel.width &&
              array[nextRow][nextCol].isMine === true
            ) {
              count++;
            }
          }
        }
        array[index][jndex].value = count;
        if (count === 0) {
          array[index][jndex].isZero = true;
        }
      }
    }
    return array;
  }

  restart() {
    this.mineArray = this.init();
  }

  timerCount(){
    this.timerInterval = setInterval(() => {
      this.timer ++;
      //console.log(this.timer);
      this.timer_minute = Math.floor(this.timer / 60);
      this.timer_second = Math.floor(this.timer % 60);
      // if( this.timer > 3000){
      //   clearInterval(this.timerInterval);
      // }
    }, 1000);
  }

  checkOver() {
    let allCount = 0;
    let mineCount = 0;
    for (let i = 0; i < this.currentLevel.height; i++) {
      for (let j = 0; j < this.currentLevel.width; j++) {
        if (
          this.mineArray[i][j].isMine === true &&
          this.mineArray[i][j].clicked === true
        ) {
          this.faceState = 'lose';
          clearInterval(this.timerInterval);
          return true;
        }
        if (
          this.mineArray[i][j].isMine === true &&
          this.mineArray[i][j].marked === true
        ) {
          mineCount++;
          if (mineCount === this.currentLevel.mineCount) {
            this.mineAllClear();
            this.faceState = 'win';
            clearInterval(this.timerInterval);
            const currentRank = {
              score: this.timer_minute + ':' + this.timer_second,
              difficulty: this.currentLevel.name,
              date: new Date().toLocaleString()
            }
            this.rank.push(currentRank);
            localStorage.setItem('mineScore',JSON.stringify(this.rank));
            return true;
          }
        }
        if (
          this.mineArray[i][j].isMine === false &&
          this.mineArray[i][j].clicked === true
        ) {
          allCount++;
          if (
            allCount ===
            this.currentLevel.height * this.currentLevel.width -
              this.currentLevel.mineCount
          ) {
            this.mineAllClear();
            this.faceState = 'win';
            clearInterval(this.timerInterval);
            const currentRank = {
              score: this.timer_minute + ':' + this.timer_second,
              difficulty: this.currentLevel.name,
              date: new Date().toLocaleString()
            }
            this.rank.push(currentRank);
            localStorage.setItem('mineScore',JSON.stringify(this.rank));
            return true;
          }
        }
      }
    }
    return false;
  }

  setFace(state: 'neutral' | 'surprise' | 'win' | 'lose') {
    this.faceState = state;
    if (state === 'surprise') {
      setTimeout(() => {
        if (this.faceState !== 'win' && this.faceState !== 'lose') {
          this.faceState = 'neutral';
        }
      }, 300);
    }
  }

  mineAllClear(){
    for (let i = 0; i < this.currentLevel.height; i++) {
      for (let j = 0; j < this.currentLevel.width; j++) {
        if(this.mineArray[i][j].isMine === true){
          this.mineArray[i][j].marked = true;
        }
        if(this.mineArray[i][j].isMine === false){
          this.mineArray[i][j].clicked = true;
        }
      }
    }
  }

  zeroMap(row: number, col: number) {
    if (this.mineArray[row][col].clicked === true) return;
    this.mineArray[row][col].clicked = true;
    //if (!this.mineArray[row][col].isZero) return;  

    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
      for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        if (deltaRow === 0 && deltaCol === 0) continue;
        const newRow = row + deltaRow;
        const newCol = col + deltaCol;
        if (
          newRow >= 0 &&
          newRow < this.currentLevel.height &&
          newCol >= 0 &&
          newCol < this.currentLevel.width) {
          if (this.mineArray[newRow][newCol].isZero) {
            this.zeroMap(newRow, newCol);
          }else{
            this.mineArray[newRow][newCol].clicked = true;    
          }        
        }
      }
    }
  }

  mineMap() {
    for (let index = 0; index < this.currentLevel.height; index++) {
      for (let jndex = 0; jndex < this.currentLevel.width; jndex++) {
        if (this.mineArray[index][jndex].isMine === true) {
          this.mineArray[index][jndex].clicked = true;
        }
      }
    }
  }

  easyClick(item: Mine, row: number, col: number) {
    if (item.marked) return;
    if (this.over) return;
    this.setFace('surprise');
    if (item.isMine === true) {
      const mineRef = document.getElementById('minecell-' + row + '-' + col);
      if (mineRef) {
        mineRef.style.background = 'red';
      }
      item.clicked = true;
      this.mineMap();
    }
    if (item.isZero === true) {
      this.zeroMap(row, col);
    }
    item.clicked = true;
    if (this.checkOver()) {
      this.over = true;
    }
  }

  dbClick(item: any, i: number, j: number) {
    if (!item.clicked) return;
    if (this.over) return;
    this.setFace('surprise');
    let markedCount = 0;
    let cellRefArray = [];
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
      for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        if (deltaRow !== 0 || deltaCol !== 0) {
          if ((i + deltaRow) >= 0 && 
              (i + deltaRow) < this.currentLevel.height && 
              (j + deltaCol) >= 0 && 
              (j + deltaCol) < this.currentLevel.width){
            
            if (this.mineArray[i + deltaRow][j + deltaCol].marked === true) {
              markedCount++;
            }
            if (this.mineArray[i + deltaRow][j + deltaCol].clicked === false && 
                this.mineArray[i + deltaRow][j + deltaCol].marked === false) {
              const cellRef = document.getElementById('minecell-' + ( i + deltaRow ) + '-' + ( j + deltaCol ));
              console.log(cellRef);
              if (cellRef) {
                cellRefArray.push(cellRef);
              }
            }
          }
        }
      }
    }
    if (markedCount < item.value) {
      console.log("doubleclick",markedCount,cellRefArray);
      cellRefArray.forEach((cellRef) => {
        cellRef.classList.add('flash-double-click');
        setTimeout(() => {
          cellRef.classList.remove('flash-double-click');
        }, 400);
      });
    } else {
      for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
          if (deltaRow !== 0 || deltaCol !== 0) {
            if (i + deltaRow >= 0 && 
                i + deltaRow < this.currentLevel.height && 
                j + deltaCol >= 0 && 
                j + deltaCol < this.currentLevel.width) {
              if (this.mineArray[i + deltaRow][j + deltaCol].marked === false) {
                if (this.mineArray[i + deltaRow][j + deltaCol].isZero === true) {
                  this.zeroMap(i + deltaRow, j + deltaCol);
                }else{
                  this.mineArray[i + deltaRow][j + deltaCol].clicked = true;
                }
                if (this.mineArray[i + deltaRow][j + deltaCol].isMine === true) {
                  const mineRef = document.getElementById(
                    'minecell-' + (i + deltaRow) + '-' + (j + deltaCol),
                  );
                  if (mineRef) {
                    mineRef.style.background = 'red';
                  }
                  this.mineMap();
                }
              }
            }
          }
        }
      }
    }
    if (this.checkOver()) {
      this.over = true;
    }
  }

  rightClick(item: Mine) {
    if (item.clicked) return;
    if (this.over) return;
    this.setFace('surprise');
    if (item.marked) {
      this.currentMine ++;
    }else{
      this.currentMine --;
    }
    item.marked = !item.marked;
    if (this.checkOver()) {
      this.over = true;
    }
  }

  changeDifficulity(number: number){
    switch(number){
      case 1:
        this.currentLevel = this.easyLevel;
        break;
      case 2:
        this.currentLevel = this.normalLevel;
        break;
      case 3:
        this.currentLevel = this.hardLevel;
        break
      case 4:
        this.currentLevel = this.erhabenLevel;
        break;
      default:
        this.currentLevel = this.easyLevel;
        break;
    }
  }

  // ------ this is then end ------ //
}

export interface Mine {
  value: number;
  clicked: boolean;
  marked: boolean;
  isZero: boolean;
  isMine: boolean;
}