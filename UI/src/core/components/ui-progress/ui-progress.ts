import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-progress',
  imports: [],
  templateUrl: './ui-progress.html',
  styleUrl: './ui-progress.scss'
})
export class UiProgress {
  @Input() valuePercent: number | undefined= 0;
  // @Input() successPercent: number | undefined = 0;

}
