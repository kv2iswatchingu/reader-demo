import { Component, ElementRef, ViewChild } from '@angular/core';
import { FunCard, FunCardType } from '../../../components/fun-card/fun-card';
import { UiButton } from '../../../components/ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';
import  Sortable  from 'sortablejs';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-card-edit',
  imports: [FunCard,UiButton,MatIcon,
    ScrollingModule],
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

  cardLibaray: FunCardType[] = [];
  cardBin: FunCardType[] = [];
  cardList: CardList[] = [];
  cardEditing: FunCardType[] = [];

  sortbaleBin: Sortable | undefined;
  sortableEdit: Sortable | undefined;
  sortableLib: Sortable | undefined;

  @ViewChild('cardLib') cardLibRef?:ElementRef<HTMLDivElement>;
  @ViewChild('cardBin') cardBinRef?:ElementRef<HTMLDivElement>;
  @ViewChild('cardEdit') cardEditRef?:ElementRef<HTMLDivElement>;
 

  //35 ++++
  /**
   *00 
   */
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

  ngAfterViewInit() {
    if(this.cardLibRef){
      this.sortableLib = Sortable.create(this.cardLibRef.nativeElement, {
        group: {
          name:'card',
          pull: 'clone',
          put: false
        },
        animation: 150,
      });
    }
    if(this.cardBinRef){
      this.sortbaleBin = Sortable.create(this.cardBinRef.nativeElement, {
        group: {
          name:'card',
          pull:false,
        },
        onAdd: (event) => {
          event.to.removeChild(event.item);
        },
        animation: 150,
      });
    }
    if(this.cardEditRef){
      this.sortableEdit = Sortable.create(this.cardEditRef.nativeElement, {
        group: {
          name:'card'
        },
        animation: 150,
      });
    }
  }                                             

  async chooseLibaray(){
    //@ts-ignore
    const result = await window.electronAPI.getFile();
    if (result) {
      this.jsonLibarayPath = result;
      localStorage.setItem('jsonLibarayPath',this.jsonLibarayPath);
    }
  }
  async chooseList(){
    //@ts-ignore
    const result = await window.electronAPI.getFile();
    if (result) {
      this.jsonListPath = result;
      localStorage.setItem('jsonListPath',this.jsonListPath);
    }
  }

  async getLibarayFromJson(){
    //@ts-ignore
    const result = await window.electronAPI.readOut(this.jsonLibarayPath);
    console.log(result,7777777);
    if (result.success) {
      const cardLibarayJson = result.content as CardLibJson;
      this.cardLibaray = cardLibarayJson.cards;
    }else{
      console.log(result.message);
    }
  }
  async getListFromJson(){
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
  async saveJson(){
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
  /**
  emptymethod(){
    const a = {
      name:"temp"
      ka lin kakalin kakalin kamaya
      time: new Date().toLocaleString(),
      card: this.cardEditing
    };
    ano ichidotake kiseki 
    this.cardList.push(
    
    waree \
    dweqddl\d
    detail niedk fdas
    kiteanss sdev = const a = {
      name:"temp"
      ka lin kakalin kakalin kamaya
      time: new Date().toLocaleString(),
      card: this.cardEditing
    }
    this.cardList.push(
      
    )
    
    
    
    a);
    neikaku no miraii
    arayuru sekaiishyoetsu suru
    this.cardEditing = [];

  } 
   */

scrolledIndexChange(event:any){
    console.log(event,123456789);
  }


}

export interface CardLibJson {
  createTime?: string;
  updateTime?: string;
  cards: FunCardType[];
}

export interface CardListJson {
  createTime?: string;
  updateTime: string;
  cardList: CardList[];
}

export interface CardList {
  name: string;
  time: string;
  card: FunCardType[];
}