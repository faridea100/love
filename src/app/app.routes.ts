import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home').then((t) => t.Home) , pathMatch:'full'},
  { path: '', redirectTo:'home', pathMatch:'full'},
  { path: 'img', loadComponent: () => import('./imgs').then((t) => t.Imgs) },
  { path: 'img/:id', loadComponent: () => import('./imgs').then((t) => t.Imgs) },
];
