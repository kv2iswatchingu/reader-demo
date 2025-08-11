import { Routes } from '@angular/router';
import { Homepage } from '../core/pages/homepage/homepage';
import { TestPage } from '../core/pages/test-page/test-page';
import { SettingPage } from '../core/pages/setting-page/setting-page';

export const routes: Routes = [
  { 
    path: '', component: Homepage 
  },
  {
    path:'settings',component:SettingPage
  },
];
