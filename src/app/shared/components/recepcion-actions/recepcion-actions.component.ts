import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Turno, TurnoEstado } from '../../../core/models/turno';
import { Jaula } from '../../../core/models/jaula';
import { TurnosService } from '../../../core/services/turnos.service';

@Component({
  selector: 'app-recepcion-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recepcion-actions">
      <ng-container [ngSwitch]="getEstado()">
        <!-- Estado: pendiente -->
        <div *ngSwitchCase="'pendiente'" class="estado-pendiente">
          <span class="estado-badge pendiente">PENDIENTE</span>
          <div class="actions">
            <select [(ngModel)]="jaulaSeleccionada" [disabled]="!jaulasDisponibles.length">
              <option value="">Seleccionar jaula</option>
              <option *ngFor="let jaula of jaulasDisponibles" [value]="jaula.idJaula">
                {{ jaula.nombre }}
              </option>
            </select>
            <button 
              type="button" 
              class="btn-iniciar"
              [disabled]="!jaulaSeleccionada || !jaulasDisponibles.length"
              (click)="iniciarRecepcion()">
              Iniciar Recepción
            </button>
          </div>
        </div>

        <!-- Estado: en recepcion -->
        <div *ngSwitchCase="'en recepcion'" class="estado-en-recepcion">
          <span class="estado-badge en-recepcion">EN RECEPCIÓN</span>
          <div class="actions">
            <span class="info">Jaula: {{ getNombreJaula() }}</span>
            <span class="info">Iniciado: {{ turno.cabecera.horaInicioRecepcion }}</span>
            <button 
              type="button" 
              class="btn-finalizar"
              (click)="finalizarRecepcion()">
              Finalizar Recepción
            </button>
          </div>
        </div>

        <!-- Estado: completado -->
        <div *ngSwitchCase="'completado'" class="estado-completado">
          <span class="estado-badge completado">COMPLETADO</span>
          <div class="info-completado">
            <span class="info">Jaula usada: {{ getNombreJaula() }}</span>
            <span class="info">Inicio: {{ turno.cabecera.horaInicioRecepcion }}</span>
            <span class="info">Fin: {{ turno.cabecera.horaFinRecepcion }}</span>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .recepcion-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
    }

    .estado-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }

    .estado-badge.pendiente {
      background-color: #ffc107;
      color: #000;
    }

    .estado-badge.en-recepcion {
      background-color: #17a2b8;
    }

    .estado-badge.completado {
      background-color: #28a745;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info {
      font-size: 12px;
      color: #666;
    }

    .info-completado {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    select {
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-iniciar {
      background-color: #007bff;
      color: white;
    }

    .btn-iniciar:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-finalizar {
      background-color: #dc3545;
      color: white;
    }

    button:hover:not(:disabled) {
      opacity: 0.8;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecepcionActionsComponent {
  @Input() turno!: Turno;
  @Input() jaulasDisponibles: Jaula[] = [];
  @Input() todasLasJaulas: Jaula[] = [];
  @Output() turnoActualizado = new EventEmitter<void>();

  jaulaSeleccionada = '';

  constructor(private turnosService: TurnosService) {}

  getEstado(): TurnoEstado {
    return this.turnosService.estado(this.turno);
  }

  getNombreJaula(): string {
    if (!this.turno.cabecera.idJaula) return 'N/A';
    const jaula = this.todasLasJaulas.find(j => j.idJaula === this.turno.cabecera.idJaula);
    return jaula?.nombre || `Jaula ${this.turno.cabecera.idJaula}`;
  }

  iniciarRecepcion(): void {
    if (!this.jaulaSeleccionada) return;
    
    const jaulaId = Number(this.jaulaSeleccionada);
    this.turnosService.iniciarRecepcion(this.turno.cabecera.idTurno, jaulaId);
    this.jaulaSeleccionada = '';
    this.turnoActualizado.emit();
  }

  finalizarRecepcion(): void {
    this.turnosService.finalizarRecepcion(this.turno.cabecera.idTurno);
    this.turnoActualizado.emit();
  }
}