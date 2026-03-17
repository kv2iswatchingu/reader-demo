import { Component, ElementRef, ViewChild } from '@angular/core';
import { UiButton } from "../../components/ui-button/ui-button";
import { Router } from '@angular/router';
import { Card } from './card.interface';

@Component({
  selector: 'app-card-page',
  imports: [UiButton],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss'
})
export class CardPage {

  constructor(
    private router: Router
  ) { }

  go2CardBattlePage(){
     this.router.navigate(['card-battle']);
  }
  go2CardEditPage(){
    this.router.navigate(['card-edit']);
  }

  myfun(){
    //const card = new Card();
    //card.enterSpecial();
  }
}

