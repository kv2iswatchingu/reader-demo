import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiButton } from "../core/components/ui-button/ui-button";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule, UiButton],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  ngOnDestroy() {
    // @ts-ignore
    window.electronAPI?.setFullscreen?.(false);
  }
}
