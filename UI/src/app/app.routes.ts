import { Routes } from '@angular/router';
import { Homepage } from '../core/pages/homepage/homepage';
import { Testpage } from '../core/pages/testpage/testpage';
import { MathTablePage } from '../core/pages/mathtable-page/mathtable-page';
import { FunMine } from '../core/pages/fun-mine/fun-mine';

export const routes: Routes = [
  { 
    path: '', component: Homepage 
  },{
    path: 'test', component: Testpage
  },{
    path: 'math-table', component: MathTablePage
  },{
    path: 'fun-mine', component: FunMine
  }
];
