import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiButton } from "../core/components/ui-button/ui-button";
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule, UiButton,MatIcon],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {

  constructor(
    private router: Router
  ) { }
  go2Homepage() {
    this.router.navigate(['']);
  }
  go2Testpage(){
    this.router.navigate(['test']);
  }

  ngOnDestroy() {
    // @ts-ignore
    window.electronAPI?.setFullscreen?.(false);
  }
}
