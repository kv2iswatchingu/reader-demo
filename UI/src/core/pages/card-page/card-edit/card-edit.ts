import { Component, ElementRef, ViewChild } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { MatIcon } from '@angular/material/icon';
import  Sortable  from 'sortablejs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UiInput } from '../../../components/ui-input/ui-input';
import { FunCard } from '../fun-card/fun-card';
import { CardList, FunCardType, CardClass, CardLibJson, CardListJson } from '../card.interface';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-edit',
  imports: [FunCard,UiButton,MatIcon,UiInput,
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

  cardList: CardList[] = [];
  cardLibaray: FunCardType[] = [];
  cardBin: FunCardType[] = [];
  cardEditing: FunCardType[] = [];
  editing: boolean = false;
  inputName: string = "";

  sortbaleBin: Sortable | undefined;
  sortableEdit: Sortable | undefined;
  sortableLib: Sortable | undefined;

  @ViewChild('cardLib') cardLibRef?:ElementRef<HTMLDivElement>;
  @ViewChild('cardBin') cardBinRef?:ElementRef<HTMLDivElement>;
  @ViewChild('cardEdit') cardEditRef?:ElementRef<HTMLDivElement>;
 
  constructor(
    private _snackBar:MatSnackBar,
    private router: Router ) {

  }

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
        sort: false,
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
          const cardIndex = event.oldIndex;
          this.cardEditing.splice(cardIndex!,1);
        },
        animation: 150,
      });
    }
    if(this.cardEditRef){
      this.sortableEdit = Sortable.create(this.cardEditRef.nativeElement, {
        group: {
          name:'card'
        },
        sort: false,
        onAdd: (event) => {
          const cardIndex = event.oldIndex;
          const card = this.cardLibaray[cardIndex!];
          const count = this.cardEditing.filter((c) => (c.name === card.name && c.class !== CardClass.Hero )).length;
          const heroCountAll = this.cardEditing.filter((c) => c.class === CardClass.Hero ).length;
          const heroCountSingle = this.cardEditing.filter((c) => ( c.class === CardClass.Hero && c.name === card.name)).length;
          event.to.removeChild(event.item);
          if(count >= 3){
            this._snackBar.open('每个卡片最多只能有3个相同卡片',"Close", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          }else if(this.cardEditing.length >= 30){
            this._snackBar.open('最多只能有30个卡片',"Close", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          }else if( heroCountAll >= 3){
            this._snackBar.open('最多只能有3个英雄卡片',"Close", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          }else if( heroCountSingle >= 1){
            this._snackBar.open('每个英雄卡片最多只能有1个',"Close", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "top",
            });
          }else{
            this.cardEditing.push(card);
            this.cardEditing.sort((a, b) => a.orginCost - b.orginCost);
          }
        },
        animation: 150,
      });
    }
  }                                             
  ngDestory(){

  }


  goBack(){
    this.router.navigate(['card-page']);
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
    //console.log(result,7777777);
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
  async deleteGroup(cardgroup: CardList){
    //@ts-ignore
    const result = await window.electronAPI.readOut(this.jsonListPath);
    if(result.success){
      let cardListJsonOrign = result.content as CardListJson;
      let cardListOrign = cardListJsonOrign.cardList;
      
      const index = cardListOrign.findIndex((item)=>
        item.name === cardgroup.name && item.time === cardgroup.time
      );
      console.log(index,77777);
      if(index != -1){
        cardListOrign.splice(index,1);
        console.log(cardListOrign,index,177777);
      }
      cardListJsonOrign.cardList = cardListOrign;
      cardListJsonOrign.updateTime = new Date().toLocaleString();
      //@ts-ignore
      const writed = await window.electronAPI.writeIn(this.jsonListPath,cardListJsonOrign);
      if(writed.success){
        alert("删除成功");
      }else{
        alert(writed.message + "失败");
      }
      this.getListFromJson();
    } else{
      alert(result.message);
    }
  }
  async saveJson(){
    if(this.cardEditing.length < 30){
      alert("至少需要30个卡片");
      return;
    }
    if(this.inputName === ""){
      alert("请输入名称");
      return;
    }

    //@ts-ignore
    const result = await window.electronAPI.readOut(this.jsonListPath);
    if(result.success){
      let cardListJsonOrign = result.content as CardListJson;
      let cardListOrign = cardListJsonOrign.cardList;
      const tempCardList = {
        name:this.inputName,
        time: new Date().toLocaleString(),
        card: this.cardEditing
      };
      cardListOrign.push(tempCardList);
      cardListJsonOrign.cardList = cardListOrign;
      cardListJsonOrign.updateTime = new Date().toLocaleString();
      //@ts-ignore
      const writed = await window.electronAPI.writeIn(this.jsonListPath,cardListJsonOrign);
      if(writed.success){
        alert("保存成功");

      }else{
        alert(writed.message + "保存失败");
      }
      this.getListFromJson();
    } else{
      alert(result.message);
    }
    this.editing = false;
  }


  method(){
    //edit -> save -> read

    
  }
  // 
  //
  //



  selectEditing(cardgroup: CardList){
    
  }

  // scrolledIndexChange(event:any){
  //     console.log(event,123456789);
  //   }
  /**
   * -10
   * >50 lljf ->hlr
   * 30 + 20 rt
   * >15 ->clys
   * 25 ->hsl
   * >30 jsds //->lel
   * >15 tzz // 20 
   * 
   * 20 + 50 + 25 + 15 - 10 = 100
   * 30 + 50 + 15 + 15 - 10 =  100
   * 
   * //bz hl cl wqnull lv2 lv1 1 nlhf2 rt1  nxnull
   * clb hlr clb hlr byr 402
   * 
   * //bz hl cl  bzwq lv1 2 rt 1
   * clb hlr hlb clb byr 394
   * 
   * 
   * //bz hl hs  hsbzwq nx3 ts2 hf1 hx1 lv1 jljh--
   * bcb hlr hlb hsb byr 402 
   * 
   * //dwg
   * bcb hlr bcb hlr byr
   * 
   * //
   * rt
   * 30 + 15 + 30 + 25 - 10 = 90 - ?15 + 20 =  
   * 
   * 
   * jj2 hs2 bz 
   * wq -> bz + msl
   * 
   * 10 + 25 + 20 
   * 
   * lj5 lj5 tz5 qj? rt?
   * 
   * 
   * 
   * 
   * 
   * 
   * 
  */


}

