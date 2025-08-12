import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIconModule } from '@angular/material/icon';
import { UiTextarea } from '../../components/ui-textarea/ui-textarea';
import { UiInput } from '../../components/ui-input/ui-input';
import { UiDialog } from '../../components/ui-dialog/ui-dialog';
import { UiViewer } from '../../components/ui-viewer/ui-viewer';
import { CardType, UICard } from "../../components/ui-card/ui-card";

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, UiButton, MatIconModule, UiTextarea, UiInput, UiDialog, UiViewer, UICard],
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
  deleteConfigText: string = '删除配置文件?';
  

  ///
  rootPath: string = ''
  filePath: string = this.rootPath;
  detailMode:boolean = false;
  floderName: string = '';
  mainTest:any = [];

  ///
  searchStr: string = '';
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
  deleteConfigDialog: boolean = false;
  configFilePath: string = '';
  imageViewerPath:string = '';
  //
  readMode: boolean = false;


  get breadCrumbList():{ name: string, fullPath:string}[]{
    const parts = this.filePath.replace(this.rootPath, '').split('/').filter(Boolean);
    let current = this.rootPath;
    const result = [{
      name: this.rootPath.split('/').filter(Boolean).pop() || this.rootPath,
      fullPath: this.rootPath
    }];
    for (const part of parts) {
      current = current.endsWith('/') ? current + part : current + '/' + part;
      result.push({ name: part, fullPath: current });
    }
    return result;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.imageViewerPath = '';
    this.rootPath = localStorage.getItem('rootPath') || '';
    this.filePath = this.rootPath;
    this.init();
  }
  init(){
    this.floderName = this.getFloderName();
    this.configFilePath = this.filePath;
    this.getAllbyDir(this.filePath);
    this.readJson();
  }
  async setMainPath() {
    //@ts-ignore
    const result = await window.electronAPI.setMainPath();
    if(result){
      this.rootPath= result;
      this.filePath = this.rootPath;
      localStorage.setItem('rootPath', this.rootPath);
    }
    this.init();
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
    this.config.path = this.configFilePath;
    //@ts-ignore
    const result = await window.electronAPI.writeIn(this.configFilePath + '/config.json',this.config );
    if(result.success){
      this.readJson();
    }
  }
  async readJson() {
    //@ts-ignore
    const result = await window.electronAPI.readOut(
      this.configFilePath + '/config.json'
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
    const result = await window.electronAPI.floderImage(this.configFilePath);
    if(result.success){
      this.coverList = result.images;
      console.log(this.coverList);
    }else{
      alert(result.message);
    }
  }
  async showConfig(file: CardType) {
    this.imageViewerPath = '';
    this.config = null;
    this.cdr.detectChanges();
    if(file.isDirectory){
      this.configFilePath = file.path;
      //@ts-ignore
      const result = await window.electronAPI.readOut(
        file.path + '/config.json'
      );
      if (result.success) {
        this.config = result.content;
        //this.editFormdata = result.content;
      } else {
        this.config = null;
      }
    }else if(file.isImage){
      this.imageViewerPath = file.path;
      this.configFilePath = this.filePath;
      this.readJson();
    }else{
      this.configFilePath = this.filePath;
      this.readJson();
    }
  }
  go2RootPath() {
    this.filePath = this.rootPath;
    this.init();
  }
  go2Path(targetPath: string) {
    if(targetPath !== this.filePath){
      this.filePath = targetPath;
      this.init();
    }
  }
  openFolder(file: CardType) {
    this.imageViewerPath = '';
    if(file.isDirectory == true){
      this.filePath = file.path;
      this.init();
    }
    if(file.name === 'config.json'){
      this.editConfig = true;
    } 
    if(file.isImage){
      //
      this.imageViewerPath = file.path;
      this.configFilePath = this.filePath;
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
  cancelAddConfig(){
    this.addConfig = false;
    this.config = null;
  }
  async deleteConfig(){
    this.deleteConfigDialog = false;
    //@ts-ignore
    const result = await window.electronAPI.removeFile(this.configFilePath + '/config.json');
    if(result){
      this.config = null;
      this.init();
    }else{
      alert('删除失败');
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
