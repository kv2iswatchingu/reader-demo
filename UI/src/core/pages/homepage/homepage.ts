import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIconModule } from '@angular/material/icon';
import { UiTextarea } from '../../components/ui-textarea/ui-textarea';
import { UiInput } from '../../components/ui-input/ui-input';
import { UiDialog } from '../../components/ui-dialog/ui-dialog';
import { UiViewer } from '../../components/ui-viewer/ui-viewer';
import { MainpathService } from '../../services/mainpath.service';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, UiButton, MatIconModule, UiTextarea, UiInput, UiDialog, UiViewer],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {
  //startText
  startText: string = '开始阅读';
  aurthorLabel: string = '作者:';
  tagLabel: string = '标签:';
  descriptionLabel: string = '简介:';
  selectCoverLabel: string = '选择封面';
  

  ///
  filePath = '/Users/zijian/workSpace/test/01';
  
  floderName: string = '';
  mainTest:any = [];
  ///
  config: ConfigJSON | null = null;
  addConfig: boolean = false;
  editConfig: boolean = false;
  addingTag: boolean = false;
  editingCover: boolean = false;
  coverList: string[] = [];
  currentCover: string = '';
  currentAddTag: string = '';
  darkmode: boolean = true;
  fullscreenflag: boolean = false;
  //
  readMode: boolean = false;

  constructor(private mainPathService: MainpathService) {}

  ngOnInit() {
    this.floderName = this.getFloderName();
    this.mainPathService.mainPath$.subscribe((path) => {
      if (path) {
        this.filePath = path;
      }
    });
    this.getAllbyDir(this.filePath);
    this.readJson();  
  }
  async getAllbyDir(dir:string){
    //@ts-ignore
    const result = await window.electronAPI.foreachAll(dir);
    if (result.success) {
      this.mainTest = result.files;
    }
  }

  async writeJson() {
    if (!this.config) return;
    this.editConfig = false;
    this.addConfig = false;
    this.config.path = this.filePath;
    //@ts-ignore
    const result = await window.electronAPI.writeIn(this.filePath + '/config.json',this.config );
    if(result.success){
      this.readJson();
    }
  }
  async readJson() {
    //@ts-ignore
    const result = await window.electronAPI.readOut(
      this.filePath + '/config.json'
    );
    if (result.success) {
      this.config = result.content;
      //this.editFormdata = result.content;
    } else {
      this.config = null;
    }
  }
  async openImages(){
    //@ts-ignore
    const result = await window.electronAPI.floderImage(this.filePath);
    if(result.success){
      this.coverList = result.images;
    }
  }

  darkmodeChange(event: boolean) {
    this.darkmode = event;
  }
  fullscreenChange(event: boolean) {
    this.fullscreenflag = event;
  }
  getFloderName(){
    const match = this.filePath.match(/([^\\/]+)\.(\w+)$/);
    if (match) {
      return match[1];
    }
    return '';
  }
  startRead() {
    this.readMode = true;
    this.openImages();
  }
  editRank(index: number) {
    if(!this.editConfig && !this.addConfig) return;
    if (this.config) {
      this.config.rank = index + 1;
    }
  }
  removeTag(index: number) {
    if(this.config){
       this.config?.tag.splice(index, 1);
    }
  }
  addTag() {
    this.addingTag = true;
    this.currentAddTag = '';
  }
  checkTag() {
    if (this.config) {
      this.config.tag.push(this.currentAddTag);
    }
    this.addingTag = false;
  }
  selectCover(){
    if(!this.editConfig && !this.addConfig) return;
    this.editingCover = true;
    this.openImages();
  }
  changeCover(cover: string) {
    this.currentCover = cover;
    if (this.config) {
      this.config.cover = cover;
    }
    this.editingCover = false;
  }
  initAddConfig() {
    this.addConfig = true;
    this.config = {
      name: '',
      tag: [],
      author: '',
      rank: 0,
      cover: '',
      description: '',
      path: '',
    }
  }

}

export interface ConfigJSON {
  name: string;
  tag: string[];
  author: string;
  rank: number;
  cover: string;
  description: string;
  path: string;
  //lianzai
}
