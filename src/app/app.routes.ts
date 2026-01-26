import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    title: 'Accueil | Portfolio SPA'
  },
  {
    path: 'projets',
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects),
    title: 'Nos Projets | Portfolio SPA'
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./pages/about/about').then(m => m.About),
    title: 'À Propos | Portfolio SPA'
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.Contact),
    title: 'Contact | Portfolio SPA'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
