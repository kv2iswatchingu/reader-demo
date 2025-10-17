import { Component } from '@angular/core';
import { UiInput } from '../../components/ui-input/ui-input';
import { UiButton } from "../../components/ui-button/ui-button";

@Component({
  selector: 'app-array-three',
  imports: [UiInput, UiButton],
  templateUrl: './array-three.html',
  styleUrl: './array-three.scss'
})
export class ArrayThree {

  axisX = 64;
  axisZ = 32;
  axisY = 32;
  array: Entity[] = [
    { x: 10, y: 20, z: 4 }
  ];
  currentX = 0;
  currentY = 0;
  currentZ = 0;

  inputStr:string = "";



  ngOnInit() {

  }

  isBlockXz(x: number, z: number) {
    return this.array.some(e => e.x == x && e.z == this.axisZ - z - 1);
  }
  addBlockXz(x: number, z: number) {
    this.array.push({ x: x, y: this.currentY, z: this.axisZ - z - 1 });
  }
  removeBlockXz(x: number, z: number) {
    this.array = this.array.filter(e => !(e.x == x && e.z == this.axisZ - z - 1 && e.y == this.currentY)); 
  }
  isBlockXy(x: number, y: number) {
    return this.array.some(e => e.x == x && e.y == this.axisY - y - 1);
  }
  addBlockXy(x: number, y: number) {
    this.array.push({ x: x, y: this.axisY - y - 1, z: this.currentZ });
  }
  removeBlockXy(x: number, y: number) {
    this.array = this.array.filter(e => !(e.x == x && e.y == this.axisY - y - 1 && e.z == this.currentZ));
  }
  isBlockYz(y: number, z: number) {
    return this.array.some(e => e.z == z && e.y == this.axisY - y - 1);
  }
  addBlockYz(y: number, z: number) {
    this.array.push({ x: this.currentX, y: this.axisY - y - 1, z: z });
  }
  removeBlockYz(y: number, z: number) {
    this.array = this.array.filter(e => !(e.z == z && e.y == this.axisY - y - 1 && e.x == this.currentX));
  }


  currentYplus() {
    if(this.currentY >= this.axisY - 1)return;
    this.currentY ++;
  }
  currentYminus() {
    if(this.currentY <= 0)return;
    this.currentY --;
  }
  currentZplus() {
    if(this.currentZ >= this.axisZ - 1)return;
    this.currentZ ++;
  }
  currentZminus() {
    if(this.currentZ <= 0)return;
    this.currentZ --;
  }currentXplus() {
    if(this.currentX >= this.axisX - 1)return;
    this.currentX ++;
  }
  currentXminus() {
    if(this.currentX <= 0)return;
    this.currentX --;
  }




  texttoxz(str: string, fontsize: number) {
    var c = document.createElement("canvas");
    c.width = this.axisX;
    c.height = this.axisZ;
    const ctx = c.getContext("2d");
    ctx!.font = "20px system-ui";

    ///
    //ctx!.fillText("Hello", 0, 15);
    //ctx!.fillText("Sekai", 0, 30);
    //ctx!.fillText("阎魔爱", 0, 20);
    ctx!.fillText("优昙华院", 0, 20);
    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */
    ///
    
    var canvasData = ctx!.getImageData(0, 0, c.width, c.height).data;
    
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
    console.log(textPoint);
    for (let z = 0; z < textPoint.length; z++) {
      for (let x = 0; x < textPoint[z].length; x++) {
        if (textPoint[z][x] === 1) {
            this.array.push({ x: x, y: 0,  z: this.axisZ - z - 1 });
        }
      }
    }
  }
 

}

export interface Entity {
  x: number;
  y: number;
  z: number;
}

export const lrc = {
  
}
