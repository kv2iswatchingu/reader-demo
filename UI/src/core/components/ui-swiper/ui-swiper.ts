import { Component, Input } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'ui-swiper',
  imports: [UiButton],
  templateUrl: './ui-swiper.html',
  styleUrl: './ui-swiper.scss',
})
export class UiSwiper {
  @Input() dirPath:string = '';
  @Input() swiperData:string[] = [];

  currentIndex = 0;
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  private dragStartX: number | null = null;
  private dragStartY: number | null = null;
  private dragging = false;
  private lastOffsetX = 0;
  private lastOffsetY = 0;
  arrowsVisible = true;
  private arrowTimer: any = null;


  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
  }
  next() {
    if (this.currentIndex < this.swiperData.length - 1) this.currentIndex++;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
  }
  changeCurrent(index:number){
    this.currentIndex = index;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
  }
  showArrows() {
    this.arrowsVisible = true;
    if (this.arrowTimer) clearTimeout(this.arrowTimer);
    this.arrowTimer = setTimeout(() => {
      this.arrowsVisible = false;
    }, 5000);
  }
  hideArrowsAfterDelay() {
    if (this.arrowTimer) clearTimeout(this.arrowTimer);
    this.arrowTimer = setTimeout(() => {
      this.arrowsVisible = false;
    }, 5000);
  }
  resetZoom() {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
  }
  

  // 鼠标滚轮缩放
  onWheel(event: WheelEvent) {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoom = Math.min(Math.round((this.zoom + 0.1) * 10) / 10, 3);
    } else {
      this.zoom = Math.max(Math.round((this.zoom - 0.1) * 10) / 10, 0.5);
      if (this.zoom === 1) {
        this.offsetX = 0;
        this.offsetY = 0;
        this.lastOffsetX = 0;
        this.lastOffsetY = 0;
      }
    }
  }

  onMouseDown(event: MouseEvent) {
    if (this.zoom > 1) {
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.dragging = true;
    } else {
      this.dragStartX = event.clientX;
      this.dragging = true;
    }
  }
  onMouseUp(event: MouseEvent) {
    if (!this.dragging || this.dragStartX === null) return;
    if (this.zoom > 1) {
      // 拖拽图片，松开时记录偏移
      this.lastOffsetX = this.offsetX;
      this.lastOffsetY = this.offsetY;
    } else {
      // 非放大时，左右切换（不循环）
      const dx = event.clientX - this.dragStartX;
      if (Math.abs(dx) > 50) {
        if (dx > 0 && this.currentIndex > 0) this.prev();
        else if (dx < 0 && this.currentIndex < this.swiperData.length - 1) this.next();
      }
    }
    this.dragStartX = null;
    this.dragStartY = null;
    this.dragging = false;
  }
  onMouseMove(event: MouseEvent) {
    if (!this.dragging || this.dragStartX === null) return;
    if (this.zoom > 1 && this.dragStartY !== null) {
      // 拖拽图片，支持多向
      let newOffsetX = this.lastOffsetX + (event.clientX - this.dragStartX);
      let newOffsetY = this.lastOffsetY + (event.clientY - this.dragStartY);

      // 限制边界，假设图片容器宽高为 w/h，图片缩放后宽高为 w*zoom/h*zoom
      // 这里只做简单限制，实际可根据容器尺寸动态调整
      const maxOffset = 300 * (this.zoom - 1); // 300为假定图片半宽/半高
      newOffsetX = Math.max(-maxOffset, Math.min(maxOffset, newOffsetX));
      newOffsetY = Math.max(-maxOffset, Math.min(maxOffset, newOffsetY));

      this.offsetX = newOffsetX;
      this.offsetY = newOffsetY;
    }
  }
}
