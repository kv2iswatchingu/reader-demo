import { Component } from '@angular/core';
import { UiButton } from "../../components/ui-button/ui-button";
import { MainpathService } from '../../services/mainpath.service';

@Component({
  selector: 'app-setting-page',
  imports: [UiButton],
  templateUrl: './setting-page.html',
  styleUrl: './setting-page.scss'
})
export class SettingPage {

  mainPath:string | null = null;

  constructor(private mainPathService: MainpathService) {}

  async setMainPath() {
    //@ts-ignore
    const result = await window.electronAPI.setMainPath();
    if(result){
      this.mainPath = result;
      this.mainPathService.setMainPath(this.mainPath);
    }
  }
}
