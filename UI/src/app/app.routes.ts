import { Routes } from '@angular/router';
import { Homepage } from '../core/pages/homepage/homepage';
import { TestPage } from '../core/pages/test-page/test-page';

export const routes: Routes = [
  { 
    path: '', component: Homepage 
  },
  {
    path:'test-page',component:TestPage
  }
];
