import { Component } from '@angular/core';
import { UiInput } from '../../components/ui-input/ui-input';
import { UiButton } from "../../components/ui-button/ui-button";
import { UiSelect } from "../../components/ui-select/ui-select";

@Component({
  selector: 'app-array-three',
  imports: [UiInput, UiButton, UiSelect],
  templateUrl: './array-three.html',
  styleUrl: './array-three.scss'
})
export class ArrayThree {

  axisX = 96;
  axisZ = 32;
  axisY = 32;
  array: Entity[] = [
    { x: 10, y: 20, z: 4 }
  ];
  currentX = 0;
  currentY = 0;
  currentZ = 0;

  inputStr:string = "";
  selectArea:string = "xz";
  options = [
    { label: 'Aera-X_Z', value: 'xz' },
    { label: 'Aera-X_Y', value: 'xy' },
    { label: 'Aera-Z_Y', value: 'zy' },
  ]
  
  ngOnInit() {}


  /**
   * 
   * @param x 
   * @param y 
   * @param z 
   * @returns 
   * 
   * [x][y]? 
   *  
   * end? [] =< {x:,y: ,rgb, isblock: }
   * rotate move changenext
   * setinterver => close 
   * full -> destory 
   * endcore ->  yAxis >= max length ? length - 1 -> showlength?
   * perfab / next -> 5 type L T I O Z middle
   * score                                                                                                                                                                                                                                                   
   * 
   * 
   *  
   *  C
   *   ./
   * 1 / 6 gravity
   * 
   *  const diva = ?
   */

  isBlock(x: number | null, y: number | null, z: number| null) {
    if ( x == null && y != null && z != null ) {
      return this.array.some(e => e.z == z && e.y == this.axisY - y - 1);
    }
    if ( y == null && x != null && z != null ) {
      return this.array.some(e => e.x == x && e.z == this.axisZ - z - 1);
    }
    if ( z == null && x != null && y != null ) {
      return this.array.some(e => e.x == x && e.y == this.axisY - y - 1);
    }
    return false;
  }
  addBlock(x: number| null, y: number| null, z: number| null){
    if ( x == null && y != null && z != null ) {
      this.array.push({ x: this.currentX, y: this.axisY - y - 1, z: z });
    }
    if ( y == null && x != null && z != null ) {
       this.array.push({ x: x, y: this.currentY, z: this.axisZ - z - 1 });
    }
    if ( z == null && x != null && y != null ) {
       this.array.push({ x: x, y: this.axisY - y - 1, z: this.currentZ });
    }
  }
  removeBlock(x:number | null , y: number | null, z: number | null){
    if ( x == null && y != null && z != null ) {
      this.array = this.array.filter(e => !(e.z == z && e.y == this.axisY - y - 1 && e.x == this.currentX));
    }
    if ( y == null && x != null && z != null ) {
      this.array = this.array.filter(e => !(e.x == x && e.z == this.axisZ - z - 1 && e.y == this.currentY)); 
    }
    if ( z == null && x != null && y != null ) {
      this.array = this.array.filter(e => !(e.x == x && e.y == this.axisY - y - 1 && e.z == this.currentZ));
    }

  }
  changeCurrent(axis:string, operator:string){
    switch(operator){
      case "plus":
        switch(axis){
          case "x":
            if(this.currentX >= this.axisX - 1)return;
            this.currentX ++;
            break;
          case "y": 
            if(this.currentY >= this.axisY - 1)return;
            this.currentY ++;  
            break;
          case "z":
            if(this.currentZ >= this.axisZ - 1)return;
            this.currentZ ++;
            break;
        }
        break;
      case "minus":
        switch(axis){
          case "x":
            if(this.currentX <= 0)return;
            this.currentX --;
            break;
          case "y":
            if(this.currentY <= 0)return;
            this.currentY --;
            break;
          case "z":
            if(this.currentZ <= 0)return;
            this.currentZ --;
            break;
        }
        break;
    }
  }
  showText() {
    const fontsize = this.getFontSizelen() > 28 ? 28 : this.getFontSizelen();
    const c = document.createElement("canvas");

    switch(this.selectArea){
      case "xz":
        c.width = this.axisX;
        c.height = this.axisZ;
        break;
      case "xy":
        c.width = this.axisX;
        c.height = this.axisY;
        break;
      case "zy":
        c.width = this.axisZ;
        c.height = this.axisY;
        break;
      default:
        c.width = this.axisX;
        c.height = this.axisZ;
        break;
    }
    const ctx = c.getContext("2d");
    ctx!.font = fontsize + "px system-ui";
    ctx!.fillText(this.inputStr, 0, fontsize);
    const canvasData = ctx!.getImageData(0, 0, c.width, c.height).data;
    
    let textPoint = [];
    for (let i = 0; i < c.height; i ++) {
      let temp: any[] = []
      textPoint.push(temp);
      for (let j = 0; j < c.width; j ++) {
        var index = i * c.width * 4 + j * 4;
        var a = canvasData[index + 3];
        temp.push(a ? 1 : 0);
      }
    }
    c.remove();
    this.array = [];
    for (let row = 0; row < textPoint.length; row++) {
      for (let col = 0; col < textPoint[row].length; col++) {
        if (textPoint[row][col] === 1) {
          switch(this.selectArea){
            case "xz":
              this.array.push({ x: col, y: this.currentY,  z: this.axisZ - row - 1 });
              break;
            case "xy":
              this.array.push({ x: col, y: this.axisY - row - 1, z: this.currentZ });
              break;
            case "zy":
              this.array.push({ x: this.currentX, y: this.axisY - row - 1, z: col });
              break;
            default:
              this.array.push({ x: col, y: this.currentY,  z: this.axisZ - row - 1 });
              break;
          }
        }
      }
    }  
  }
  getFontSizelen(){  
    let len = 0;  
    //console.log(this.inputStr.length,88888888888);
    for (let i = 0; i < this.inputStr.length; i++) {   
      var c = this.inputStr.charCodeAt(i);   
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
        len++;   
      }   
      else {   
        len+=2;   
      }   
    }   
    return 128 /(len == 0 ? 1 : len);
  }
  //
   

  save(){
    const data = JSON.stringify(this.array);
    // const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    // saveAs(blob, "arrayThree.json");
    localStorage.setItem('arrayThree',data);
    ///electron
    // this.electronService.ipcRenderer.send('saveArrayThree',data);

  }

  
  /**
   * zzi

Copy
Play
// 如果为 true 时，移动鼠标会在画布上绘制
bin dll 
let isDrawing 2222s= false;
let x = 0;
let y = 0ǐ

const myPics = document.getElementById("myPics");
const context = myPics.getContext("2d");

a blaze of courage the dragon's mind has gone
// event.offsetX 与 event.offsetY 给出与画布边缘的 (x,y) 的偏移量。
// 向 mousedown、mousemove 与 mouseup 事件添加事件侦听器
its mouth and its raws and its memories has gone
myPics.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

myPics.addEventListener("mousemove", (e) => {
knocking the door of truth  a red lizard and a girl in blue
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;kl,..........
    y = e.offsetY;
  obrass the chaos aweken me
  }
});


window.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    rebirth and destroction here are my command
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    again and again
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  i will strike the sky when the last chain breaks
  context.strokeStyle = "black";
  make it ashes and ruins
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
   * 
   * 
   */
}

export interface Entity {
  x: number;
  y: number;
  z: number;
}


