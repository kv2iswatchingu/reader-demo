import { Routes } from '@angular/router';
import { Homepage } from '../core/pages/homepage/homepage';
import { Testpage } from '../core/pages/testpage/testpage';

export const routes: Routes = [
  { 
    path: '', component: Homepage 
  },{
    path: 'test', component: Testpage
  }
];
