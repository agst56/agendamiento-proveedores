import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turno } from '../../../core/models/turno';
import { TurnosService } from '../../../core/services/turnos.service';

@Component({
  selector: 'app-turno-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="turno-details">
      <div class="header">
        <h4>Turno #{{ turno.cabecera.idTurno }}</h4>
        <span class="estado-badge" [ngClass]="getEstado()">
          {{ getEstadoLabel() }}
        </span>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <label>Proveedor:</label>
          <span>{{ turno.cabecera.proveedor.nombre }}</span>
        </div>
        
        <div class="info-item">
          <label>Fecha:</label>
          <span>{{ turno.cabecera.fecha }}</span>
        </div>
        
        <div class="info-item">
          <label>Horario agendado:</label>
          <span>{{ turno.cabecera.horaInicioAgendamiento }} - {{ turno.cabecera.horaFinAgendamiento }}</span>
        </div>
        
        <div class="info-item" *ngIf="turno.cabecera.jaula">
          <label>Jaula asignada:</label>
          <span>{{ turno.cabecera.jaula.nombre }}</span>
        </div>
        
        <div class="info-item" *ngIf="turno.cabecera.horaInicioRecepcion">
          <label>Inicio recepción:</label>
          <span>{{ turno.cabecera.horaInicioRecepcion }}</span>
        </div>
        
        <div class="info-item" *ngIf="turno.cabecera.horaFinRecepcion">
          <label>Fin recepción:</label>
          <span>{{ turno.cabecera.horaFinRecepcion }}</span>
        </div>
      </div>

      <div class="productos" *ngIf="turno.detalles.length">
        <h5>Productos:</h5>
        <ul>
          <li *ngFor="let detalle of turno.detalles">
            {{ detalle.producto.nombre }}: {{ detalle.cantidad }} unidades
          </li>
        </ul>
      </div>

      <div class="estado-info">
        <h5>Estados del sistema:</h5>
        <ul>
          <li><strong>pendiente:</strong> campo inicio recepcion no tiene valor</li>
          <li><strong>en recepcion:</strong> campo inicio recepcion tiene valor y campo fin recepcion no tiene valor</li>
          <li><strong>completado:</strong> campo fin recepcion tiene valor</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .turno-details {
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .estado-badge.pendiente {
      background-color: #ffc107;
      color: #000;
    }

    .estado-badge.en-recepcion {
      background-color: #17a2b8;
      color: white;
    }

    .estado-badge.completado {
      background-color: #28a745;
      color: white;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      font-weight: bold;
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }

    .productos {
      margin-bottom: 16px;
    }

    .productos h5 {
      margin: 0 0 8px 0;
    }

    .productos ul {
      margin: 0;
      padding-left: 20px;
    }

    .estado-info {
      border-top: 1px solid #ddd;
      padding-top: 16px;
    }

    .estado-info h5 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .estado-info ul {
      margin: 0;
      padding-left: 20px;
      font-size: 12px;
      color: #666;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TurnoDetailsComponent {
  @Input() turno!: Turno;

  constructor(private turnosService: TurnosService) {}

  getEstado() {
    return this.turnosService.estado(this.turno);
  }

  getEstadoLabel(): string {
    const estado = this.getEstado();
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en recepcion': return 'En Recepción';
      case 'completado': return 'Completado';
      default: return 'Desconocido';
    }
  }
}
