import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  modules = [
    {
      title: 'Proveedores',
      description: 'Gestionar información de proveedores',
      icon: '🏢',
      route: '/proveedores',
      color: '#007bff'
    },
    {
      title: 'Productos',
      description: 'Administrar catálogo de productos',
      icon: '📦',
      route: '/productos',
      color: '#28a745'
    },
    {
      title: 'Jaulas',
      description: 'Control de jaulas y disponibilidad',
      icon: '🏠',
      route: '/jaulas',
      color: '#ffc107'
    },
    {
      title: 'Reserva de Turnos',
      description: 'Programar nuevos turnos de recepción',
      icon: '📅',
      route: '/turnos',
      color: '#17a2b8'
    },
    {
      title: 'Recepción',
      description: 'Ejecutar y controlar recepciones del día',
      icon: '📋',
      route: '/recepcion',
      color: '#dc3545'
    }
  ];
}
