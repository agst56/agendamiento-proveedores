import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(c => c.LandingComponent)
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./features/proveedores/proveedores.module').then(m => m.ProveedoresModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./features/productos/productos.module').then(m => m.ProductosModule)
  },
  {
    path: 'jaulas',
    loadChildren: () => import('./features/jaulas/jaulas.module').then(m => m.JaulasModule)
  },
  {
    path: 'turnos',
    loadChildren: () => import('./features/turnos/turnos.module').then(m => m.TurnosModule)
  },
  {
    path: 'recepcion',
    loadChildren: () => import('./features/recepcion/recepcion.module').then(m => m.RecepcionModule)
  }
];
