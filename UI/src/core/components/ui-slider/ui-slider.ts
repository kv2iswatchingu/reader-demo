import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-slider',
  imports: [],
  templateUrl: './ui-slider.html',
  styleUrl: './ui-slider.scss'
})
export class UiSlider {
  @Input() sliderBallWidth: number = 16;
  @Input() sliderWidth: number = 200;
  @Input() railwayColor: string = '#cbd5e1';
  @Input() progressColor: string = '#409eff'; 
  @Input() handleColor: string = '#1c56a7';
  @Input() overlayColor: string = '#ffffff';
  @Input() showRadius: boolean = false;
  @Input() oneMode: boolean = false;
  @Output() getPercent = new EventEmitter<number>();
  @Output() getCount = new EventEmitter<number>();
  
  count = 0
  percent = 0

  deltaSliderWidth = 184;
  lastColor = 'red';
  currentColor = 'blue';
  isAnimating = false;
  angle = 0;
  lastAngle = 0;
  deltaX = 0;
  deltaY = 0;
  originalX = 0;
  originalY = 0;
  onMouseMoveBind = this.onMouseMove.bind(this);
  onMouseUpBind = this.onMouseUp.bind(this);

  constructor() { }

  ngOnInit() { 
    this.deltaSliderWidth = this.sliderWidth - this.sliderBallWidth;
    this.currentColor = this.progressColor;
    this.lastColor = this.railwayColor;
  }
  ngAfterViewInit() { 
    const initRadian = 0;
    const radian = initRadian * Math.PI * 2 - Math.PI;
    this.lastAngle = radian;
    const initX = ( this.deltaSliderWidth - this.sliderBallWidth  ) / 2 + this.deltaSliderWidth / 2 * Math.cos(radian);
    const initY = ( this.deltaSliderWidth - this.sliderBallWidth  ) / 2 + this.deltaSliderWidth / 2 * Math.sin(radian);
    this.deltaX = initX;
    this.deltaY = initY;    
  }

  onMouseDown(event: MouseEvent) {
    this.originalX = event.clientX - this.deltaX;
    this.originalY = event.clientY - this.deltaY;
    document.addEventListener('mousemove', this.onMouseMoveBind);
    document.addEventListener('mouseup', this.onMouseUpBind);
  }
  onMouseUp(event: MouseEvent) {
    document.removeEventListener('mousemove', this.onMouseMoveBind);
    document.removeEventListener('mouseup', this.onMouseUpBind);
  }
  onMouseMove(event: MouseEvent) {
    const radius = this.deltaSliderWidth / 2;
    const center = ( this.deltaSliderWidth - this.sliderBallWidth ) / 2;
    const deltaTempX = event.clientX - this.originalX;
    const deltaTempY = event.clientY - this.originalY;
    
    const angleRadians = Math.atan2(deltaTempY - center, deltaTempX - center);
    this.angle = angleRadians + Math.PI;
    this.percent = Math.floor( (this.angle) / (Math.PI * 2) * 100 );
    this.getPercent.emit(this.percent);
    

    if (this.lastAngle < -Math.PI / 2 && angleRadians > Math.PI / 2) {
      this.count --;
      this.getCount.emit(this.count);
      if( this.count === 1 ){
        this.currentColor = this.lastColor;
        this.lastColor = this.progressColor;
      }else if( this.count === 0){
        this.currentColor = this.progressColor;
        this.lastColor = this.railwayColor;
      }else{
        this.currentColor = this.lastColor;
        this.lastColor = this.randomRgbColor();
      }
    }
    if (this.lastAngle > Math.PI / 2 && angleRadians < -Math.PI / 2) {
      this.count ++;
      this.getCount.emit(this.count);
      if( this.count === -1 ){
        this.lastColor = this.currentColor;
        this.currentColor = this.railwayColor
      }else if( this.count === 0){
        this.currentColor = this.progressColor;
        this.lastColor = this.railwayColor;
      }else{
        this.lastColor = this.currentColor;
        this.currentColor = this.randomRgbColor();
      }
    }
    
    this.lastAngle = angleRadians;

    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    this.deltaX = center + radius * cos;
    this.deltaY = center + radius * sin;
    
  }
  countUp(){
    if (this.isAnimating || this.oneMode) return; // 节流，动画中不响应
    this.isAnimating = true;
    const steps = 60; 
    let frame = 0;
    const startAngle = this.lastAngle;
    const endAngle = startAngle + Math.PI * 2;
    let lastFrameAngle = startAngle;
    const radius = this.deltaSliderWidth / 2;
    const center = (this.deltaSliderWidth - this.sliderBallWidth) / 2;

    const animate = () => {
      frame++;
      const currentAngle = startAngle + (endAngle - startAngle) * (frame / steps);
      console.log(currentAngle,this.lastAngle);
      if ( currentAngle >= Math.PI && currentAngle <= Math.PI + 0.1 ) {
        this.count++;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!")
        this.getCount.emit(this.count);
        if( this.count === -1 ){
          this.lastColor = this.currentColor;
          this.currentColor = this.railwayColor
        }else if( this.count === 0){
          this.currentColor = this.progressColor;
          this.lastColor = this.railwayColor;
        }else{
          this.lastColor = this.currentColor;
          this.currentColor = this.randomRgbColor();
        }
      }
      lastFrameAngle = currentAngle;
     
      const cos = Math.cos(currentAngle);
      const sin = Math.sin(currentAngle);
      this.deltaX = center + radius * cos;
      this.deltaY = center + radius * sin;
      this.angle = ( currentAngle + Math.PI ) % (Math.PI * 2);
      this.percent = Math.floor( (this.angle) / (Math.PI * 2) * 100 );
      this.getPercent.emit(this.percent);
      if (frame < steps) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };
    animate();
  }
  randomRgbColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

}
