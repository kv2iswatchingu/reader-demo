import { Component } from '@angular/core';
import { UiButton } from '../../components/ui-button/ui-button';

@Component({
  selector: 'app-test-page',
  imports: [UiButton],
  templateUrl: './test-page.html',
  styleUrl: './test-page.scss'
})
export class TestPage {
  fileList:any;
  tempDir = '/Users/zijian/workSpace/test/01';
  mycontent = ''

  ngOninit() {
    
  }

  async loadDict(dirPath: string) {
    // @ts-ignore
    const result = await window.electronAPI.listDirectory(dirPath);
    if (result.success) {
      console.log(result.files)
      this.fileList = result.files;
    }
  }

  //get info by json
  async getInfoByJson(dirPath: string) {
    // @ts-ignore
    const result = await window.electronAPI.listJson(dirPath)
    if (result.success) {
      console.log(result);
      this.mycontent = JSON.stringify(result.content);
    }
  }
}
