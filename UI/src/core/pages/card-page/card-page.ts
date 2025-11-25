import { Component, ElementRef, ViewChild } from '@angular/core';
import { FunCard, FunCardType } from '../../components/fun-card/fun-card';
import { UiButton } from "../../components/ui-button/ui-button";
import { Router } from '@angular/router';

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
}