import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from "../../components/ui-button/ui-button";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, UiButton,MatIconModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {
[x: string]: any;
  
  //startText
  startText:string = '开始阅读';
  aurthorLabel:string = '作者:';
  tagLabel:string = '标签:';
  descriptionLabel:string = '简介:'



  ///
  filePath = '/Users/zijian/workSpace/test/01';
  config:ConfigJSON | null = null;
  editConfig:boolean = false;

  ngOnInit(){
    this.readJson();
  }

  

  async writeJson(){
    const tempC = {
      name: 'test',
      tag: ['test'],
      author: 'test',
      rank: 2,
      cover:'test',
      description: 'test et test set est rtesttt res'
    }
    alert('test');
    this.editConfig = false;
    // //@ts-ignore
    // const result = await window.electronAPI.writeIn(this.filePath + '/config.json',tempC );
    // if(result.success){
    //   alert('写入成功');
    //   this.readJson();
    // }else{
    //   alert('写入失败' + result.message);
    // }
  }

  async readJson(){
    //@ts-ignore
    const result = await window.electronAPI.readOut(this.filePath + '/config.json');
    if(result.success){
      this.config = result.content;
    }else{
      alert('读取失败' + result.message);
    }
  }

}

export interface ConfigJSON {
  name: string,
  tag: string[],
  author: string,
  rank: number,
  cover: string,
  description: string
}