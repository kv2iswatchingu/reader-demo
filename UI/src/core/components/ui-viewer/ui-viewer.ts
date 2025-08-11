import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ui-viewer',
  imports: [UiButton,MatIcon],
  templateUrl: './ui-viewer.html',
  styleUrls: ['./ui-viewer.scss'],
})
export class UiViewer {
  @Input() dirPath:string = '';
  @Input() viewerData:string[] = [];
  @Output() darkmodeChange = new EventEmitter<boolean>();
  @Output() fullscreenChange = new EventEmitter<boolean>();
  @ViewChild('filmstripInner') filmstripInner!: ElementRef<HTMLDivElement>;
  

  currentIndex = 0;
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  fullscreenflag: boolean = false;
  toolsVisible = true;
  darkmode = true
  private dragStartX: number | null = null;
  private dragStartY: number | null = null;
  private dragging = false;
  private lastOffsetX = 0;
  private lastOffsetY = 0;
  private arrowTimer: any = null;

  ngOnInit() {
    // @ts-ignore
    window.electronAPI?.onFullscreenChanged?.((isFullscreen: boolean) => {
      this.fullscreenflag = isFullscreen;
      this.fullscreenChange.emit(this.fullscreenflag);
    });
  }
  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
  }
  next() {
    if (this.currentIndex < this.viewerData.length - 1) this.currentIndex++;
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
  showHiddens() {
    this.toolsVisible = true;
    if (this.arrowTimer) clearTimeout(this.arrowTimer);
    this.arrowTimer = setTimeout(() => {
      this.toolsVisible = false;
    }, 5000);
  }
  hideArrowsAfterDelay() {
    if (this.arrowTimer) clearTimeout(this.arrowTimer);
    this.arrowTimer = setTimeout(() => {
      this.toolsVisible = false;
    }, 5000);
  }
  resetZoom() {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
  }
  toggleDarkmode(){
    this.darkmode = !this.darkmode;
    this.darkmodeChange.emit(this.darkmode);
  }
  fullscreen() {
    this.fullscreenflag = !this.fullscreenflag;
    // @ts-ignore
    window.electronAPI.setFullscreen(this.fullscreenflag);
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
        else if (dx < 0 && this.currentIndex < this.viewerData.length - 1) this.next();
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

  // 鼠标拖动滑动
  private filmDragStartX: number | null = null;
  private filmDragStartScroll: number = 0;
  private filmDragging = false;

  onFilmstripMouseDown(event: MouseEvent) {
    this.filmDragStartX = event.clientX;
    this.filmDragStartScroll = this.filmstripInner.nativeElement.scrollLeft;
    this.filmDragging = true;
    this.filmstripInner.nativeElement.style.cursor = 'grabbing';
  }
  onFilmstripMouseMove(event: MouseEvent) {
    if (!this.filmDragging || this.filmDragStartX === null) return;
    const dx = event.clientX - this.filmDragStartX;
    this.filmstripInner.nativeElement.scrollLeft = this.filmDragStartScroll - dx;
  }
  onFilmstripMouseUp(event: MouseEvent) {
    this.filmDragging = false;
    this.filmstripInner.nativeElement.style.cursor = 'grab';
    this.filmDragStartX = null;
  }

}
