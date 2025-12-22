import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { DigitalNumber } from '../../components/digital-number/digital-number';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tetoris-page',
  imports: [UiButton,DigitalNumber],
  templateUrl: './tetoris-page.html',
  styleUrl: './tetoris-page.scss',
})
export class TetorisPage {

  startText: string = 'START';
  stopText: string = 'STOP';

  tetoris: Tetoris[][] = Array.from({ length: 32 }, () =>
    Array.from({ length: 14 }, () => ({
      color: 'transparent',
      status: 0,
    })),
  );

  pred: Tetoris[][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => ({
      color: 'transparent',
      status: 0,
    })),
  );

  interval: any;
  currentBlock: ShapeBase = new ShapeBase(0, 0);
  predBlock: ShapeBase | null = null;

  color: string = 'transparent';
  score: number = 0;
  timer: number = 0;
  timer_minute: number = 0;
  timer_second: number = 0;
  timerInterval:any;

  overflag: boolean = false;
  rank: {
    date: string,
    time: string,
    score: number
  }[] = [];

  listener = (event: KeyboardEvent) => {
    if (!this.currentBlock) return;
    //if (  == 1) return;
    let dx = 0, dy = 0;
    if (event.key === 'a' || event.key === 'ArrowLeft' || event.key === 'A') {
      dx = -1;
      this.move(dx,dy);
    }
    else if (event.key === 'd' || event.key === 'ArrowRight' || event.key === 'D') {
      dx = 1;
      this.move(dx,dy);
    }
    else if (event.key === 's' || event.key === 'ArrowDown' || event.key === 'S') {
      dy = 1;
      this.moveDown(dx,dy);
    }
    else if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 'W') {
      this.rotate();
    }     
  }

  ngOnInit() {
    if(localStorage.getItem('tetorisScore')){
      this.rank = JSON.parse(localStorage.getItem('tetorisScore')!);
    }
  }

  // ngAfterViewInit() {
  //   this.start();
  // }
  /** 
   *  
   * 
   * 
   * 
   * 
  */

  ngDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
    removeEventListener('keydown', this.listener, true);
  }

  constructor(private _snackBar: MatSnackBar) {}

  start(){
    this.overflag = false;
    this.predBlock = null;
    removeEventListener('keydown', this.listener, true);
    this.control();
    this.clearAll();
    this.init();
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.interval = setInterval(() => {
      this.moveDown(0, 1);
    }, 500);
    this.timerCount();
  }
  stop(){
    if(this.overflag) return;
    //this.clearAll();
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
    this.overflag = true;
    this._snackBar.open('GameStoped',"Close", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
    removeEventListener('keydown', this.listener, true);
  }

  init() {
    this.clear(this.tetoris);
    const newBlock = this.createRandomShape(5, 0);
    const newpred = this.createRandomShape(5, 0);

    const blocked = newpred.blocks.some(cell => {
      return (
        cell.y >= 0 &&
        cell.y < this.tetoris.length &&
        cell.x >= 0 &&
        cell.x < this.tetoris[0].length &&
        this.tetoris[cell.y][cell.x].status === 1
      );
    });

    if (blocked) {
      clearInterval(this.interval);
      clearInterval(this.timerInterval);
      this.overflag = true;
      removeEventListener('keydown', this.listener,true);
      this._snackBar.open('GameOver',"Close", {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      const currentRank = {
        score: this.score,
        date: new Date().toLocaleString(),
        time: this.timer_minute + ':' + this.timer_second,
      }
      this.rank.push(currentRank);
      localStorage.setItem('tetorisScore',JSON.stringify(this.rank));
      return;
    }
    
    if(this.predBlock){
      this.currentBlock = this.predBlock;
      this.predBlock = newpred;
    }else{
      this.currentBlock = newBlock;
      this.predBlock = newpred;
    }
    this.color = this.randomRgbColor();
    this.renderTetoris(this.color);
    this.renderPred();
  }

  control() { 
    addEventListener('keydown', this.listener, true);
  }
  renderTetoris(color?: string) {
    this.clear(this.tetoris);
    for (const cell of this.currentBlock.blocks) {
      if (
        cell.y >= 0 &&
        cell.y < this.tetoris.length &&
        cell.x >= 0 &&
        cell.x < this.tetoris[0].length
      ) {
        if(color) {
          this.tetoris[cell.y][cell.x].color = color;
        }
        this.tetoris[cell.y][cell.x].status = 2;
      }
    }
  }

  renderPred(){
    this.clear(this.pred);
    if(this.predBlock){
      for (const cell of this.predBlock.blocks) {
          this.pred[cell.y][cell.x - 5].color = "#CCC";
          this.pred[cell.y][cell.x - 5].status = 2;
      }
    }
  }

  clear(array:Tetoris[][]){
    array.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (array[rowIndex][colIndex].status === 2) {
          array[rowIndex][colIndex].color = 'transparent';
          array[rowIndex][colIndex].status = 0;
        }
      });
    });
  }


  clearAll() {
    this.tetoris.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        this.tetoris[rowIndex][colIndex].color = 'transparent';
        this.tetoris[rowIndex][colIndex].status = 0;
      });
    });
  }

  
  createRandomShape(x: number, y: number): ShapeBase {
    const shapes = [
      ShapeI_1,
      ShapeI_2,
      ShapeI_1,
      ShapeI_2,
      ShapeO,
      ShapeO,
      ShapeT_1,
      ShapeT_2,
      ShapeT_3,
      ShapeT_4,
      ShapeT_1,
      ShapeT_2,
      ShapeT_3,
      ShapeT_4,
      ShapeL_1,
      ShapeL_2,
      ShapeL_3,
      ShapeL_4,
      ShapeJ_1,
      ShapeJ_2,
      ShapeJ_3,
      ShapeJ_4,
      ShapeN_1,
      ShapeN_2,
      ShapeZ_1,
      ShapeZ_2,
      ShapeN_1,
      ShapeN_2,
      ShapeZ_1,
      ShapeZ_2,
    ];
    const idx = Math.floor(Math.random() * shapes.length);
    return new shapes[idx](x, y);
  }

  randomRgbColor() {
    var r = Math.floor(Math.random() * 150 + 50);
    var g = Math.floor(Math.random() * 150 + 50);
    var b = Math.floor(Math.random() * 150 + 50);
    return `rgb(${r},${g},${b})`;
  }

  move(dx:number,dy:number){
    for (const cell of this.currentBlock.blocks) {
      const newX = cell.x + dx;
      if ( newX < 0 || newX >= this.tetoris[0].length ) {
        return;
      }
    }
    const canMove = this.currentBlock.blocks.every(cell => {
      const newX = cell.x + dx;
      if (this.tetoris[cell.y][newX].status === 1) return false;
      return true;
    });
    if(!canMove) return;
    this.currentBlock.blocks.forEach((cell) => {
      cell.x += dx;
      cell.y += dy;
    });
    this.currentBlock.x += dx;
    this.currentBlock.y += dy;
    this.renderTetoris(this.color);
  }

  moveDown(dx:number,dy:number){
    const canMove = this.currentBlock.blocks.every(cell => {
      const newY = cell.y + dy;
      if (newY >= this.tetoris.length) return false;
      if (this.tetoris[newY][cell.x].status === 1) return false;
      return true;
    });
    if (!canMove) {
      this.currentBlock.blocks.forEach(cell => {
        if (
          cell.y >= 0 &&
          cell.y < this.tetoris.length &&
          cell.x >= 0 &&
          cell.x < this.tetoris[0].length
        ) {
          this.tetoris[cell.y][cell.x].status = 1;
          this.tetoris[cell.y][cell.x].color = this.color;
        }
      });
      this.init();
      this.clearLine();
      return;
    }
    this.currentBlock.blocks.forEach(cell => {
      cell.x += dx;
      cell.y += dy;
    });
    this.currentBlock.x += dx;
    this.currentBlock.y += dy;
    this.renderTetoris(this.color);

    //
    
  }
  /**8
   * from a shape to another
   * const afunction = () => {
   *     this.currentBlock = new ShapeI_1(this.currentBlock.x, this.currentBlock.y);
   *     this.renderTetoris(this.color);
   *     this.renderPred();CMINE
   *     this.renderNext();
   *     this.renderScore();//??
   *    if(this.overflag) this.init();
   * switch (this.currentBlock.constructor) {
   *   case ShapeI_1:
   *     this.currentBlock = new ShapeI_2(this.currentBlock.x, this.currentBlock.y);  
   *     break;
   *   case ShapeI_2:
   *     this.currentBlock = new ShapeI_1(this.currentBlock.x, this.currentBlock.y);
   *     break;
   *   22//
   *     case ShapeI_1:
   *     this.currentBlock = new ShapeI_2(this.currentBlock.x, this.currentBlock.y);
   *     break;
   *   case ShapeI_2:
   *     this.currentBlock = new ShapeI_1(this.currentBlock.x, this.currentBlock.y);
   *     break;
   *
   }
   * }
   */

  rotate(){
    let nextBlock: ShapeBase;
    switch (this.currentBlock.constructor) {
      case ShapeI_1:
        nextBlock = new ShapeI_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeI_2:
        nextBlock = new ShapeI_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeT_1:
       nextBlock = new ShapeT_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeT_2:
        nextBlock = new ShapeT_3(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeT_3:
        nextBlock = new ShapeT_4(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeT_4:
        nextBlock= new ShapeT_1(this.currentBlock.x, this.currentBlock.y);
        break;
      
      case ShapeJ_1:
        nextBlock = new ShapeJ_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeJ_2:
        nextBlock = new ShapeJ_3(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeJ_3:
        nextBlock = new ShapeJ_4(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeJ_4:
       nextBlock = new ShapeJ_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeL_1:
        nextBlock = new ShapeL_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeL_2:
        nextBlock = new ShapeL_3(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeL_3:
        nextBlock = new ShapeL_4(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeL_4:
        nextBlock = new ShapeL_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeN_1:
        nextBlock = new ShapeN_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeN_2:
        nextBlock = new ShapeN_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeZ_1:
        nextBlock = new ShapeZ_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeZ_2:
        nextBlock = new ShapeZ_1(this.currentBlock.x, this.currentBlock.y);
        break;

      default:
        nextBlock = this.currentBlock;
        break;
    }
    const canRotate = nextBlock.blocks.every(cell => {
      if(
        cell.x < 0 &&
        cell.x >= this.tetoris[0].length &&
        cell.y < 0 &&
        cell.y >= this.tetoris.length
      ){
        return false;
      }
      if( this.tetoris[cell.y][cell.x].status === 1 ){
        return false;
      }
      return true;
    })
    if(canRotate){
      this.currentBlock = nextBlock;
      this.renderTetoris(this.color);
    }
  }

  clearLine() {
    const lineArr = [];

    this.tetoris.forEach((row, rowIndex) => {
      const array = row.filter((cell, colIndex) => {
        return cell.status === 1;
      });
      if (array.length === 14) {
        lineArr.push(rowIndex);
        for( let i = 0; i < array.length; i++ ) {
          array[i].status = 0;
          array[i].color = 'transparent';
        }
        for (let i = rowIndex - 1; i > 0; i--) {
          this.tetoris[i].forEach((item, index) => {
            if (item.status === 1) {
              this.tetoris[i + 1][index].status = 1;
              this.tetoris[i + 1][index].color = item.color;
              item.status = 0;
              item.color = 'transparent';
            }
          })
        }
        this.renderTetoris();
      }
      
    })
    switch (lineArr.length) {
      case 1:
        this.score += 40;
        break;
      case 2:
        this.score += 100;
        break;
      case 3:
        this.score += 300;
        break;
      case 4:
        this.score += 1200;
        break;
      default:
        break;
    }
  }

  timerCount(){
    this.timerInterval = setInterval(() => {
      this.timer ++
      this.timer_minute = Math.floor(this.timer / 60);
      this.timer_second = Math.floor(this.timer % 60);
    }, 1000);
  }
  /**
    * 123/456/789/ABC/DEF/
    *    08 09 10 11          10
    *                         09
    *       09 10             08
    *       09 10      10     11
    *                  09               08
    *   08 09 10       08 08      11 11 08    08 08                  
    *   08                                       11
    *                  09                        11
    *   08 09 10       09    11           10 11
    *         11    11 10    10 09 09     09
    *                                     09
    *      09 10             09
    *         10 11          10 10
    *                           11  
    *      09 10        10
    *   11 10           09 10
    *                      11
    *      10       90       09 10 11     90
    *   09 10 11    10 11       10     11 10  
    *               10                    11
    */
  /**
   * what makes sky blue who was the first ask
   * was he a fool a sage or just a lonely friend
   *
   *
   * at the end of the world and end of story
   * the birth of new king
   * oh my lonely friend come weatiness this new form
   * weatiness the sight and what would you think
   * will you kneel for me or go mad with jeasusous
   * neither of them are my wishes but whatever happens to you will
   * satisfy me
   *
   * what kind of dream did you dream
   * would you tell me and i will make it come true
   * i cannot stop in this moment, my life will
   * burn in brillant
   */
}

export interface Tetoris {
  color: string;
  status: number;
}

//Shapes
export class ShapeBase {
  blocks: { x: number; y: number }[] = [];
  //color: string = '#ff0000';

  constructor(
    public x: number,
    public y: number,
  ) {}
}

export class ShapeI_1 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x + 2, y: y },
      { x: x + 3, y: y },
    ];
  }
}
export class ShapeI_2 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y + 2 },
      { x: x, y: y + 3 },
    ];
  }
}
export class ShapeO extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];
  }
}
export class ShapeL_1 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x + 2, y: y },
      { x: x, y: y + 1 },
    ];
  }
}
export class ShapeL_2 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y + 2 },
      { x: x + 1, y: y + 2 },
    ];
  }
}
export class ShapeL_3 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x + 2, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 2, y: y + 1 },
    ];
  }
}
export class ShapeL_4 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y + 2 },
    ];
  }
}
export class ShapeJ_1 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x + 2, y: y },
      { x: x + 2, y: y + 1 },
    ];
  }
}
export class ShapeJ_2 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y + 2 },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y + 2 },
    ];
  }
}
export class ShapeJ_3 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 2, y: y + 1 },
    ];
  }
}
export class ShapeJ_4 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x, y: y + 2 },
    ];
  }
}
export class ShapeZ_1 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
      { x: x + 2, y: y + 1 },
    ];
  }
}
export class ShapeZ_2 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x, y: y + 2 },
    ];
  }
}
export class ShapeN_1 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x + 1, y: y },
      { x: x + 2, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];
  }
}
export class ShapeN_2 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y + 2 },
    ];
  }
}
export class ShapeT_1 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x + 2, y: y + 1 },
    ];
  }
}
export class ShapeT_2 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x, y: y + 2 },
    ];
  }
}
export class ShapeT_3 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x, y: y },
      { x: x + 1, y: y },
      { x: x + 2, y: y },
      { x: x + 1, y: y + 1 },
    ];
  }
}
export class ShapeT_4 extends ShapeBase {
  constructor(x: number, y: number) {
    super(x, y);
    this.blocks = [
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y + 2 },
      { x: x, y: y + 1 },
    ];
  }
}
