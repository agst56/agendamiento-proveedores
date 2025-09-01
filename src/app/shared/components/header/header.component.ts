import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <a routerLink="/" class="logo">
          🚛 Agendamiento Proveedores
        </a>
        <nav class="nav-menu">
          <a routerLink="/proveedores" routerLinkActive="active">Proveedores</a>
          <a routerLink="/productos" routerLinkActive="active">Productos</a>
          <a routerLink="/jaulas" routerLinkActive="active">Jaulas</a>
          <a routerLink="/turnos" routerLinkActive="active">Turnos</a>
          <a routerLink="/recepcion" routerLinkActive="active">Recepción</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: #343a40;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .logo:hover {
      color: #ffc107;
    }
    
    .nav-menu {
      display: flex;
      gap: 2rem;
    }
    
    .nav-menu a {
      color: #adb5bd;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    
    .nav-menu a:hover {
      color: white;
      background: rgba(255,255,255,0.1);
    }
    
    .nav-menu a.active {
      color: #ffc107;
      background: rgba(255,193,7,0.1);
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        padding: 0 1rem;
      }
      
      .nav-menu {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .nav-menu a {
        padding: 0.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class HeaderComponent {}
