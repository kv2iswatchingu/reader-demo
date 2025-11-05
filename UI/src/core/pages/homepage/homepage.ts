import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../../components/ui-button/ui-button';
import { MatIconModule } from '@angular/material/icon';
import { UiTextarea } from '../../components/ui-textarea/ui-textarea';
import { UiInput } from '../../components/ui-input/ui-input';
import { UiDialog } from '../../components/ui-dialog/ui-dialog';
import { UiViewer } from '../../components/ui-viewer/ui-viewer';
import { CardType, UICard } from '../../components/ui-card/ui-card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    UiButton,
    MatIconModule,
    UiTextarea,
    UiInput,
    UiDialog,
    UiViewer,
    UICard,
    MatTooltipModule,
    ScrollingModule
  ],
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
  deleteFolderText: string = '确认删除文件或文件夹?';
  showExistText: string = '文件/文件夹已存在，是否自动重命名粘贴？';

  ///
  rootPath: string = '';
  filePath: string = this.rootPath;
  detailMode: boolean = false;
  floderName: string = '';
  mainTest: any = [];
  groups: any = [];
  showImgSingle: boolean = false;
  ///
  showsort: boolean = false;
  sortOptions = [
    { value: 'name', label: '按文件名称排序', icon: 'sort_by_alpha' },
    { value: 'mtime', label: '按修改时间排序', icon: 'update' },
    { value: 'birthtime', label: '按创建时间排序', icon: 'date_range' },
    { value: 'size', label: '按文件大小排序', icon: 'storage' },
  ];
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
  imageViewerPath: string = '';
  //
  readMode: boolean = false;
  //
  showMenu = false;
  menuX = 0;
  menuY = 0;
  menuItem: any = null;
  showExist: boolean = false;
  clipboard: { type: 'copy' | 'cut'; path: string } | null = null;
  rename: boolean = false;
  renameNameStr: string = '';
  deleteFolder: boolean = false;
  breadCrumbList: { name: string; fullPath: string }[] = [];
  pathsep: string = 'null';
  @ViewChild('group') groupRef: ElementRef | undefined;

  ///////////console
   getBreadCrumbList(){
    console.log(this.pathsep,1234567890);
    const parts = this.filePath
      .replace(/\\/g, this.pathsep)
      .replace(this.rootPath, '')
      .split(this.pathsep)
      .filter(Boolean);
    let current = this.rootPath;
    const result = [
      {
        name: this.rootPath.split(this.pathsep).filter(Boolean).pop() || this.rootPath,
        fullPath: this.rootPath,
      },
    ];
    for (const part of parts) {
      current = current.endsWith(this.pathsep) ? current + part : current + this.pathsep + part;
      result.push({ name: part, fullPath: current });
    }
   this.breadCrumbList = result;
  }

  //trackByPath(index: number, file: any) { return file.path; }
  
  // get groupedFiles() {
  //   this.groups = [];
  //   
  //   return this.groups;
  // }

  constructor(private cdr: ChangeDetectorRef,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.imageViewerPath = '';
    this.rootPath = localStorage.getItem('rootPath') || '';
    this.filePath = this.rootPath;
    this.init();
    document.addEventListener('mousedown', this.onGlobalClick, true);
  }
  ngOnDestroy() {
    document.removeEventListener('mousedown', this.onGlobalClick, true);
  }

  async init() {
    //@ts-ignore
    this.pathsep = await window.electronAPI.getPathsep();
    this.floderName = this.getFloderName();
    this.configFilePath = this.filePath;
    this.getAllbyDir(this.filePath);
    this.readJson();
    this.getBreadCrumbList();
  }
  async setMainPath() {
    //@ts-ignore
    const result = await window.electronAPI.setMainPath();
    if (result) {
      this.rootPath = result;
      this.filePath = this.rootPath;
      localStorage.setItem('rootPath', this.rootPath);
    }
    this.init();
  }
  async getAllbyDir(dir: string) {
    //@ts-ignore
    const result = await window.electronAPI.foreachAll(dir);
    if (result.success) {
      //this.mainTest = [...result.files,...result.files,...result.files];
      this.mainTest = result.files;
      this.groupedInLine();
    }
  }


  groupedInLine(){
    let cols = 5;
    this.groups = [];
    if(this.groupRef){
      const clientWidth = this.groupRef.nativeElement.clientWidth;
      cols = Math.floor( clientWidth / 228 );
    }
    for (let i = 0; i < this.mainTest.length; i += cols) {
      this.groups.push(this.mainTest.slice(i, i + cols));
    }
  }

  async writeJson() {
    if (!this.config) return;
    this.editConfig = false;
    this.addConfig = false;
    this.config.path = this.configFilePath;
    //@ts-ignore
    const result = await window.electronAPI.writeIn(
      this.configFilePath + '/config.json',
      this.config
    );
    if (result.success) {
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
  async openImages() {
    //@ts-ignore
    const result = await window.electronAPI.floderImage(this.configFilePath);
    if (result.success) {
      this.coverList = result.images;
      
    } else {
      this.snackBar.open(result.message,'',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }
  async showConfig(file: CardType) {
    this.imageViewerPath = '';
    this.config = null;
    this.cdr.detectChanges();
    if (file.isDirectory) {
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
    } else if (file.isImage) {
      this.imageViewerPath = file.path;
      this.configFilePath = this.filePath;
      this.readJson();
    } else if (file.isJson) {
      const filePath = file.path.replace('/config.json', '');
      this.configFilePath = filePath;
      this.readJson();
    } else {
      this.configFilePath = this.filePath;
      this.readJson();
    }
  }
  go2RootPath() {
    this.filePath = this.rootPath;
    this.init();
  }

  // console!!!!
  go2Path(targetPath: string) {
    if (targetPath !== this.filePath) {
      this.filePath = targetPath;
      this.init();
    }
  }
  openFolder(file: CardType) {
    this.imageViewerPath = '';
    if (file.isDirectory == true) {
      this.filePath = file.path;
      this.init();
    }
    if (file.name === 'config.json') {
      this.editConfig = true;
    }
    if (file.isImage) {
      //
      this.imageViewerPath = file.path;
      this.configFilePath = this.filePath;
      this.showImgSingle = true;
    }
  }

  darkmodeChange(event: boolean) {
    this.darkmode = event;
  }
  fullscreenChange(event: boolean) {
    this.fullscreenflag = event;
  }
  getFloderName() {
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
    if (!this.editConfig && !this.addConfig) return;
    if (this.config) {
      this.config.rank = index + 1;
    }
  }
  removeTag(index: number) {
    if (this.config) {
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
  selectCover() {
    if (!this.editConfig && !this.addConfig) return;
    this.editingCover = true;
    this.openImages();
  }
  changeCover(cover: string) {
    this.currentCover = cover;
    if (this.config) {
      this.config.cover = cover;
    }
    this.editingCover = false;
    this.currentCover = '';
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
    };
  }
  cancelAddConfig() {
    this.addConfig = false;
    this.config = null;
  }
  sortBy(value: string) {
    this.mainTest.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) => {
        if (a[value] > b[value]) {
          return 1;
        } else if (a[value] < b[value]) {
          return -1;
        } else {
          return 0;
        }
      }
    );
  }
  async deleteConfig() {
    this.deleteConfigDialog = false;
    //@ts-ignore
    const result = await window.electronAPI.removeFile(
      this.configFilePath + '/config.json'
    );
    if (result) {
      this.config = null;
      this.init();
    } else {
      this.snackBar.open('删除失败','',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  async search() {
    if (this.searchStr === '') return;
    //@ts-ignore
    const result = await window.electronAPI.searchFile(this.filePath, {
      filename: this.searchStr,
    });

    if (result.success) {
      this.mainTest = result.result;
    } else {
      this.snackBar.open(result.message,'',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  async searchByConfig(str: string, type: string) {
    let configArr: ConfigJSON[] = [];
    let fileArr: CardType[] = [];
    //@ts-ignore
    const result = await window.electronAPI.searchFile(this.rootPath, {
      filename: 'config.json',
    });
    if (result.success) {
      const files = result.result;
      for (const file of files) {
        //@ts-ignore
        const content = await window.electronAPI.readOut(file.path);
        if (content.success) {
          configArr.push(content.content);
        } else {
          this.snackBar.open(content.message,'',{
            duration: 3000, 
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      }
      if (type == 'author') {
        const res = configArr.filter((item) => item.author === str);
        if (res) {
          for (const item of res) {
            //@ts-ignore
            const result = await window.electronAPI.readDir(item.path);
            if (result.success) {
              fileArr.push(result.file);
            } else {
              this.snackBar.open(result.message,'',{
                duration: 3000, 
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            }
          }
          this.mainTest = fileArr;
        }
      } else if (type == 'tag') {
        const res = configArr.filter((item) => item.tag.includes(str));
        if (res) {
          for (const item of res) {
            //@ts-ignore
            const result = await window.electronAPI.readDir(item.path);
            if (result.success) {
              fileArr.push(result.file);
            } else {
              this.snackBar.open(result.message,'',{
                duration: 3000, 
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            }
          }
          this.mainTest = fileArr;
        }
      }
    } else {
      this.snackBar.open(result.message,'',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  onRightClick(event: MouseEvent, file: any) {
    this.showConfig(file);
    event.preventDefault();
    this.showMenu = true;
    this.menuX = event.clientX;
    this.menuY = event.clientY;
    this.menuItem = file;
  }
  onGlobalClick = (event: MouseEvent) => {
    if (!this.showMenu) return;
    const menu = document.querySelector('.context-menu');
    if (menu && menu.contains(event.target as Node)) {
      return;
    }
    this.showMenu = false;
  };
  copy() {
    this.showMenu = false;
    this.clipboard = { type: 'copy', path: this.menuItem.path };
  }
  cut() {
    this.showMenu = false;
    this.clipboard = { type: 'cut', path: this.menuItem.path };
  }
  renaming() {
    this.renameNameStr = this.menuItem.name;
    this.rename = true;
    this.showMenu = false;
  }
  delete() {
    this.deleteFolder = true;
    this.showMenu = false;
  }
  async newFolder() {
    const floderName = '新文件夹';
    let destPath = this.filePath + '/' + floderName;
    // @ts-ignore
    const exists = await window.electronAPI.existsPath(destPath);
    if (exists) {
      let flag = true;
      let i = 1;
      do {
        const newName = floderName + '(' + i + ')';
        destPath = this.filePath + '/' + newName;
        // @ts-ignore
        flag = await window.electronAPI.existsPath(destPath);
        i++;
      } while (flag);
    }
    // @ts-ignore
    const result = await window.electronAPI.createFolder(destPath);
    if (result.success) {
      this.init();
    } else {
      this.snackBar.open(result.message,'',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }
  async paste(destPath?: string) {
    if (this.clipboard == null) return;
    const srcPath = this.clipboard.path;
    if (destPath == null) {
      destPath = this.filePath + '/' + srcPath.split('/').pop();
    }
    // @ts-ignore
    const exists = await window.electronAPI.existsPath(destPath);
    if (exists) {
      this.showExist = true;
    } else {
      let result;
      if (this.clipboard.type === 'copy') {
        // @ts-ignore
        result = await window.electronAPI.copyPath({ srcPath, destPath });
      } else if (this.clipboard.type === 'cut') {
        // @ts-ignore
        result = await window.electronAPI.movePath({
          oldPath: srcPath,
          newPath: destPath,
        });
      }
      if (result && result.success) {
        // 检查并更新 config.json 的 path 字段
        await this.updateConfigPath(destPath);
        this.init();
        this.clipboard = null;
      } else if (result) {
        this.snackBar.open(result.message,'',{
          duration: 3000, 
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    }
  }
  async updateConfigPath(targetPath: string) {
    // 判断是文件夹还是文件
    // @ts-ignore
    const stat = await window.electronAPI.statPath(targetPath);
    let configPath = '';
    if (stat.isDirectory) {
      configPath = targetPath + '/config.json';
    } else if (stat.isFile && targetPath.endsWith('config.json')) {
      configPath = targetPath;
      targetPath = targetPath.replace(/\/config\.json$/, '');
    }
    if (configPath) {
      // @ts-ignore
      const result = await window.electronAPI.readOut(configPath);
      if (result.success && result.content) {
        const config = result.content;
        config.path = targetPath;
        // @ts-ignore
        await window.electronAPI.writeIn(configPath, config);
      }
    }
  }

  async autoRename() {
    if (this.clipboard == null) return;
    this.showExist = false;
    const srcPath = this.clipboard.path;
    let baseName = srcPath.split('/').pop()!;
    let destPath = this.filePath + '/' + baseName;
    // @ts-ignore
    let exists = true;
    if (exists) {
      const extMatch = baseName.match(/(\.[^.]*)$/);
      const ext = extMatch ? extMatch[1] : '';
      const nameWithoutExt = ext ? baseName.slice(0, -ext.length) : baseName;
      let i = 1;
      let newName;
      do {
        newName = `${nameWithoutExt}(${i})${ext}`;
        destPath = this.filePath + '/' + newName;
        // @ts-ignore
        exists = await window.electronAPI.existsPath(destPath);
        i++;
      } while (exists);
    }
    this.paste(destPath);
  }
  async deleteFolderConfirm() {
    if (this.menuItem == null) return;
    this.deleteFolder = false;
    // @ts-ignore
    const result = await window.electronAPI.removePath(this.menuItem.path);
    if (result.success) {
      this.init();
    } else {
      this.snackBar.open(result.message,'',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }
  async renameConfirm() {
    if (!this.menuItem || this.renameNameStr === '') return;
    const oldPath = this.menuItem.path;
    const destPath = this.filePath + '/' + this.renameNameStr;
    // @ts-ignore
    const exists = await window.electronAPI.existsPath(destPath);
    if (exists) {
      this.snackBar.open('文件已存在','',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }
    // @ts-ignore
    const result = await window.electronAPI.movePath({
      oldPath,
      newPath: destPath,
    });
    if (result.success) {
      this.init();
      this.rename = false;
    } else {
      this.snackBar.open(result.message,'',{
        duration: 3000, 
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }


  //======//
  scrolledIndexChange(event:any){
    console.log(event,123456789);
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


