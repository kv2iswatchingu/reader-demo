import { Component } from '@angular/core';
import { FunCard } from '../../../components/fun-card/fun-card';

@Component({
  selector: 'app-card-edit',
  imports: [],
  templateUrl: './card-edit.html',
  styleUrl: './card-edit.scss'
})
export class CardEdit {

  //outside read json library
  // electron read -> json
  //save to floder -> json

  editCardList = false;
  noLibaray = true;
  jsonLibarayPath = "";
  jsonListPath = "";

  cardLibaray: FunCard[] = [];
  cardList: CardList[] = [];
  cardEditing: FunCard[] = [];


  ngOnInit() {
    if(localStorage.getItem('jsonLibarayPath')){
      this.noLibaray = false;
      this.jsonLibarayPath = localStorage.getItem('jsonLibarayPath')!;
    }else{
      this.noLibaray = true;
    }
    if(localStorage.getItem('jsonListPath')){
      this.jsonListPath = localStorage.getItem('jsonListPath')!;
    }
    this.getLibarayFromJson();
    this.getListFromJson();
  }

  chooseLibaray(){
    //@ts-ignore
    const result = await window.electronAPI.getFile();
    if (result.success) {
      this.jsonLibarayPath = result.path;
      localStorage.setItem('jsonLibarayPath',this.jsonLibarayPath);
    }else{
      console.log(result.message);
    }
  }
  chooseList(){
    //@ts-ignore
    const result = await window.electronAPI.getFile();
    if (result.success) {
      this.jsonListPath = result.path;
      localStorage.setItem('jsonListPath',this.jsonListPath);
    }else{
      console.log(result.message);
    }
  }

  getLibarayFromJson(){
    //@ts-ignore
    const result = await window.electronAPI.readOut(this.jsonLibarayPath);
    if (result.success) {
      const cardLibarayJson = result.content as CardLibJson;
      this.cardLibaray = cardLibarayJson.cards;
    }else{
      console.log(result.message);
    }
  }
  getListFromJson(){
    //@ts-ignore
    const result = await window.electronAPI.readOut(this.jsonListPath);
    if (result.success) {
      const cardListJson = result.content as CardListJson;
      this.cardList = cardListJson.cardList;
    }else{
      console.log(result.message);
    }
  }

  //---         
  saveJson(){
    //@ts-ignore
    const result = window.electronAPI.readOut(this.jsonListPath);
    if(result.success){
      let cardListJsonOrign = result.content as CardListJson;
      let cardListOrign = cardListJsonOrign.cardList;
      const tempCardList = {
        name:"temp",
        time: new Date().toLocaleString(),
        card: this.cardEditing
      };
      cardListOrign.push(tempCardList);
      cardListJsonOrign.cardList = cardListOrign;
      cardListJsonOrign.updateTime = new Date().toLocaleString();
      //@ts-ignore
      window.electronAPI.writeIn(this.jsonListPath,cardListJsonOrign);
    }
  }

  //----
  emptymethod(){
    // const a = {
    //   name:"temp",
    //   time: new Date().toLocaleString(),
    //   card: this.cardEditing
    // };
    // this.cardList.push(a);
    //
    
  }




}

export interface CardLibJson {
  createTime?: string;
  updateTime?: string;
  cards: FunCard[];
}

export interface CardListJson {
  createTime?: string;
  updateTime: string;
  cardList: CardList[];
}

export interface CardList {
  name: string;
  time: string;
  card: FunCard[];
}