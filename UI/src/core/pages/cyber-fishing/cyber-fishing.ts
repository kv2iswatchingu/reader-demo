import { Component, ViewChild } from '@angular/core';
import { UiSlider } from '../../components/ui-slider/ui-slider';

@Component({
  selector: 'app-cyber-fishing',
  imports: [UiSlider],
  templateUrl: './cyber-fishing.html',
  styleUrl: './cyber-fishing.scss'
})
export class CyberFishing {
  /**
   * 
   * ✅demo-1:  -> progress ++ 
   * ❌demo-2 paowuxian - paowuxian touying yuanzhuihanshu XXXXX
   * demo-3 xulitiao component
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


  @ViewChild('slider') slider: UiSlider | undefined;

  count = 0;
  percent = 0;

  getCount(count: number){
    this.count = count;
  }
  getPercent(percent: number){
    this.percent = percent;
  }


  onClick(){
    if(this.slider){
      this.slider.countUp();
    }
  }

  

}
