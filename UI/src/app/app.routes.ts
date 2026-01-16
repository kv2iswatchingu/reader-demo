import { Routes } from '@angular/router';
import { Homepage } from '../core/pages/homepage/homepage';
import { Testpage } from '../core/pages/testpage/testpage';
import { MathTablePage } from '../core/pages/mathtable-page/mathtable-page';
import { FunMine } from '../core/pages/fun-mine/fun-mine';
import { CyberFishing } from '../core/pages/cyber-fishing/cyber-fishing';
import { ArrayThree } from '../core/pages/array-three/array-three';
import { CardPage } from '../core/pages/card-page/card-page';
import { CardEdit } from '../core/pages/card-page/card-edit/card-edit';
import { CardBattle } from '../core/pages/card-page/card-battle/card-battle';
import { RolyaPage } from '../core/pages/rolya-page/rolya-page';
import { TetorisPage } from '../core/pages/tetoris-page/tetoris-page';
import { TwentyOnePage } from '../core/pages/twentyOne-page/twentyOne-page';
import { ClearPage } from '../core/pages/clear-page/clear-page';
import { TouhoPage } from '../core/pages/touho-page/touho-page';

export const routes: Routes = [
  { 
    path: '', component: Homepage 
  },{
    path: 'test', component: Testpage
  },{
    path: 'math-table', component: MathTablePage
  },{
    path: 'fun-mine', component: FunMine
  },{
    path: 'cyber-fishing', component: CyberFishing 
  },{
    path: 'array-three', component: ArrayThree
  },{
    path: 'card-page', component: CardPage
  },{
    path: 'card-battle', component: CardBattle
  },{
    path: 'card-edit', component: CardEdit
  },{
    path: 'twentyOne-page', component: TwentyOnePage
  },{
    path: 'tetoris-page', component: TetorisPage
  },{
    path: 'clear-page', component: ClearPage
  },{
    path: 'touho-page', component: TouhoPage
  }
];
