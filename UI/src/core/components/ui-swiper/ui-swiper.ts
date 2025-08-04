import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ui-swiper',
  imports: [],
  templateUrl: './ui-swiper.html',
  styleUrl: './ui-swiper.scss',
  animations:[
      trigger('carousel', [
      state('show', style({ opacity: 1,display:'block' })),
      state('hide',style({ opacity: 0,display:'none'})),
      transition('hide  => show', [style({ opacity: 0 }), animate(300)]),
      transition('show => hide', animate(300, style({ opacity: 0 })))
    ])
  ]
})
export class UiSwiper {
  @Input() bannerData:any[] = [];

  currentIndex = 0;
  changeCurrent(index:number){
    this.currentIndex = index;
    console.log(this.currentIndex)
  }
  
}
