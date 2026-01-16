import { Component } from '@angular/core';

@Component({
  selector: 'app-rythme-page',
  imports: [],
  templateUrl: './rythme-page.html',
  styleUrl: './rythme-page.scss'
})
export class RythmePage {

  dictionary:string[]= [];
  colorArray: string[] = [];

  constructor() {}

  ngOnInit(): void {
    //this.initPressDown();
  }

  ngOnDestroy(): void {
    //this.initPressDown();
  }

  initPressDown(){
    /**
     *  keybord - > ?
     * 
     * current == pressdown - in time?
     * setinterval? fast late prefect // miss bad good
     * 250ms?
     * press two
     * 
     * 
     */
  }

  yinshe?(){
    
  }

  

}
