import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'species',
    loadComponent: () =>
      import('./features/species/species.component').then(m => m.SpeciesComponent)
  },
  {
    path: 'combats',
    loadComponent: () =>
      import('./features/combats/combats.component').then(m => m.CombatsComponent)
  },
  {
    path: 'ranking',
    loadComponent: () =>
      import('./features/ranking/ranking.component').then(m => m.RankingComponent)
  },
  { path: '**', redirectTo: '' }
];
