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
  go2MathTablePage(){
    this.router.navigate(['math-table']);
  }
  go2FunMinePage(){
    this.router.navigate(['fun-mine']);
  }

  go2CyberFinshing(){
    this.router.navigate(['cyber-fishing']);
  }

  go2ArrayThree(){
    this.router.navigate(['array-three']);
  }

  go2CardPage(){
    this.router.navigate(['card-page']);
  }

  go2TwentyOne(){
    this.router.navigate(['twentyOne-page']);
  }

  go2Tetoris(){
    this.router.navigate(['tetoris-page']);
  }
  go2ClearPage(){
    this.router.navigate(['clear-page']);
  }

  ngOnDestroy() {
    // @ts-ignore
    window.electronAPI?.setFullscreen?.(false);
  }
}

