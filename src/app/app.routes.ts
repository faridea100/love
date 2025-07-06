import { Routes } from '@angular/router';
import { InstallButton } from './install-button';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home').then((t) => t.Home) , pathMatch:'full'},
  { path: '', component: InstallButton, },
  { path: 'img', loadComponent: () => import('./imgs').then((t) => t.Imgs) },
  { path: 'img/:id', loadComponent: () => import('./imgs').then((t) => t.Imgs) },
];
