import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';
import { DigitalNumber } from '../../components/digital-number/digital-number';

@Component({
  selector: 'app-tetoris-page',
  imports: [UiButton,DigitalNumber],
  templateUrl: './tetoris-page.html',
  styleUrl: './tetoris-page.scss',
})
export class TetorisPage {
  tetoris: Tetoris[][] = Array.from({ length: 32 }, () =>
    Array.from({ length: 14 }, () => ({
      color: 'transparent',
      status: 0,
    })),
  );

  interval: any;
  currentBlock: ShapeBase = new ShapeBase(0, 0);
  color: string = 'transparent';
  score: number = 0;
  timer: number = 0;
  timer_minute: number = 0;
  timer_second: number = 0;
  timerInterval:any;
  listener:any;


  renderTetoris(color?: string) {
    this.clear();
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
        //this.tetoris[cell.y][cell.x].color = color; // 或其它颜色
        this.tetoris[cell.y][cell.x].status = 2; // 2 表示活动块
      }
    }
  }

  clear(){
    this.tetoris.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (this.tetoris[rowIndex][colIndex].status === 2) {
          this.tetoris[rowIndex][colIndex].color = 'transparent';
          this.tetoris[rowIndex][colIndex].status = 0;
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
  //let a = new shapeI_1(0,0);

  ngOnInit() {
    this.control();
  }

  ngDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
    removeEventListener('keydown', this.listener);
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
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  start(){
    this.clearAll();
    this.init();
    clearInterval(this.interval);
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.interval = setInterval(() => {
      this.moveDown(0, 1);
    }, 750);
    this.timerCount();
  }

  init() {
    this.clear();
    const newBlock = this.createRandomShape(5, 0);
    const blocked = newBlock.blocks.some(cell => {
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
      alert('失败：新方块位置已被占用');
      return;
    }
    this.currentBlock = newBlock;
    this.color = this.randomRgbColor();
    this.renderTetoris(this.color);
  }

  control() { 
    this.listener = addEventListener('keydown', (event) => {
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
    });
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
      this.init(); // 生成新块
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
  }

  rotate(){
    switch (this.currentBlock.constructor) {
      case ShapeI_1:
        this.currentBlock = new ShapeI_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeI_2:
        this.currentBlock = new ShapeI_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeT_1:
        this.currentBlock = new ShapeT_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeT_2:
        this.currentBlock = new ShapeT_3(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeT_3:
        this.currentBlock = new ShapeT_4(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeT_4:
        this.currentBlock = new ShapeT_1(this.currentBlock.x, this.currentBlock.y);
        break;
      
      case ShapeJ_1:
        this.currentBlock = new ShapeJ_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeJ_2:
        this.currentBlock = new ShapeJ_3(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeJ_3:
        this.currentBlock = new ShapeJ_4(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeJ_4:
        this.currentBlock = new ShapeJ_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeL_1:
        this.currentBlock = new ShapeL_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeL_2:
        this.currentBlock = new ShapeL_3(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeL_3:
        this.currentBlock = new ShapeL_4(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeL_4:
        this.currentBlock = new ShapeL_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeN_1:
        this.currentBlock = new ShapeN_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeN_2:
        this.currentBlock = new ShapeN_1(this.currentBlock.x, this.currentBlock.y);
        break;

      case ShapeZ_1:
        this.currentBlock = new ShapeZ_2(this.currentBlock.x, this.currentBlock.y);
        break;
      case ShapeZ_2:
        this.currentBlock = new ShapeZ_1(this.currentBlock.x, this.currentBlock.y);
        break;

      default:
        break;
    }
    this.renderTetoris(this.color);
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
      this.timer ++;
      //console.log(this.timer);
      this.timer_minute = Math.floor(this.timer / 60);
      this.timer_second = Math.floor(this.timer % 60);
    }, 1000);
  }

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
