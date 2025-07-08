import { Routes } from '@angular/router';
import { InstallButton } from './install-button';

export const routes: Routes = [
  { path: '', component: InstallButton, },
  { path: 'home', loadComponent: () => import('./home').then((t) => t.Home) , pathMatch:'full'},
  { path: 'img', loadComponent: () => import('./imgs').then((t) => t.Imgs) },
  { path: 'img/:id', loadComponent: () => import('./imgs').then((t) => t.Imgs) },
  { path: '**', redirectTo:'home'}
];
