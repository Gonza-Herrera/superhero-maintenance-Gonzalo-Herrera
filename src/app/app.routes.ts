import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: 'heroes',
      loadComponent: () => import('./components/heroes-list/heroes-list.component')
    },
    {
      path: 'hero/new',
      loadComponent: () => import('./forms/hero-form/hero-form.component')
    },
    {
      path: 'hero/edit/:id',
      loadComponent: () => import('./forms/hero-form/hero-form.component')
    },
    { path: '**', redirectTo: 'heroes' }
  ];