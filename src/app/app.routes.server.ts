import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Prerender static routes
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'proveedores',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'proveedores/nuevo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'productos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'productos/nuevo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'jaulas',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'jaulas/nuevo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'turnos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'recepcion',
    renderMode: RenderMode.Prerender
  },
  // Use SSR for parameterized routes
  {
    path: 'proveedores/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'productos/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'jaulas/:id',
    renderMode: RenderMode.Server
  },
  // Fallback to prerender for any other routes
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
