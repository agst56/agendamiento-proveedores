import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  modules = [
    {
      title: 'Proveedores',
      description: 'Gestionar información de proveedores',
      icon: 'business',
      route: '/proveedores',
      color: '#1976d2'
    },
    {
      title: 'Productos',
      description: 'Administrar catálogo de productos',
      icon: 'inventory',
      route: '/productos',
      color: '#388e3c'
    },
    {
      title: 'Jaulas',
      description: 'Control de jaulas y disponibilidad',
      icon: 'view_module',
      route: '/jaulas',
      color: '#f57c00'
    },
    {
      title: 'Reserva de Turnos',
      description: 'Programar nuevos turnos de recepción',
      icon: 'schedule',
      route: '/turnos',
      color: '#00796b'
    },
    {
      title: 'Recepción',
      description: 'Ejecutar y controlar recepciones del día',
      icon: 'receipt_long',
      route: '/recepcion',
      color: '#d32f2f'
    }
  ];

  stats = {
    proveedores: 12,
    productos: 45,
    jaulas: 8,
    turnos: 3
  };
}
