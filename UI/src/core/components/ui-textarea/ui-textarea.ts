import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-textarea',
  imports: [],
  templateUrl: './ui-textarea.html',
  styleUrl: './ui-textarea.scss'
})
export class UiTextarea {
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() cols: number = 30;
  @Input() rows: number = 1;
  @Input() readOnly: boolean = false;
  @Input() noDrop: boolean = true;
  @Output() valueChange = new EventEmitter<string>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const textarea = document.getElementById(this.name);
    if(textarea){
      textarea.style.height = 'auto'; 
      textarea.style.height = (textarea.scrollHeight) + 'px';
    }
    this.cdr.detectChanges();
  }

  onInput(event: Event) {
    const textarea = document.getElementById(this.name);
    if(textarea){
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
      });
    }
    const newValue = (event.target as HTMLTextAreaElement).value;
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  ngOnDestroy() {
    const textarea = document.getElementById(this.name);
    if(textarea){
      textarea.removeEventListener('input', () => {});
    }
  }
  
}
