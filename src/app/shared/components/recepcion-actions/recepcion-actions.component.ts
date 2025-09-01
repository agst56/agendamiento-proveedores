import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Turno, TurnoEstado } from '../../../core/models/turno';
import { Jaula } from '../../../core/models/jaula';
import { TurnosService } from '../../../core/services/turnos.service';
import { JaulasService } from '../../../core/services/jaulas.service';
import { nowHHmm } from '../../../core/utils/time';
import { IniciarRecepcionDialog } from './dialogs/iniciar-recepcion-dialog.component';
import { FinalizarRecepcionDialog } from './dialogs/finalizar-recepcion-dialog.component';
import { DetallesRecepcionDialog } from './dialogs/detalles-recepcion-dialog.component';

export interface RecepcionChangeEvent {
  type: 'iniciada' | 'finalizada';
  turno: Turno;
  success: boolean;
  jaulaId?: number;
  timestamp: string;
}

@Component({
  selector: 'app-recepcion-actions',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule,
    MatIconModule,
    
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="actions-inline" [ngSwitch]="getEstado()">
      <!-- Detalles siempre visible sin fondo -->
      <button
        mat-icon-button
        class="transparent-button"
        (click)="verDetalles()"
        matTooltip="Ver detalles del turno">
        <mat-icon>visibility</mat-icon>
      </button>

      <!-- Iniciar cuando está pendiente - solo borde -->
      <button
        *ngSwitchCase="'pendiente'"
        mat-stroked-button
        color="primary"
        class="bordered-button"
        (click)="abrirDialogoIniciar()"
        matTooltip="Iniciar recepción">
        <mat-icon>play_arrow</mat-icon>
        <span class="label">Iniciar</span>
      </button>

      <!-- Finalizar cuando está en recepción - solo borde -->
      <button
        *ngSwitchCase="'en recepcion'"
        mat-stroked-button
        color="primary"
        class="bordered-button"
        (click)="abrirDialogoFinalizar()"
        matTooltip="Finalizar recepción">
        <mat-icon>stop</mat-icon>
        <span class="label">Finalizar</span>
      </button>
    </div>
  `,
  styles: [`
    .actions-inline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .actions-inline .label {
      margin-left: 4px;
      background: transparent;
    }

    /* Botón del ojo sin fondo */
    .transparent-button {
      background: transparent !important;
      box-shadow: none !important;
      color: black;
    }

    .bordered-button{
        background: transparent !important;
        border: 1px solid black;
    }



    :host { display: inline-block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecepcionActionsComponent implements OnInit {
  @Input() turno!: Turno;
  @Output() recepcionChanged = new EventEmitter<RecepcionChangeEvent>();
  
  jaulasDisponibles: Jaula[] = [];
  todasLasJaulas: Jaula[] = [];

  jaulaSeleccionada = '';
  
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor(
    private turnosService: TurnosService,
    private jaulasService: JaulasService
  ) {}

  ngOnInit() {
    this.cargarJaulas();
  }

  cargarJaulas() {
    this.jaulasService.list().subscribe({
      next: (jaulas: Jaula[]) => {
        this.todasLasJaulas = jaulas;
        this.jaulasDisponibles = jaulas.filter(j => j.enUso === 'N');
      },
      error: (error: any) => {
        console.error('Error cargando jaulas:', error);
        this.jaulasDisponibles = [];
        this.todasLasJaulas = [];
      }
    });
  }

  getEstado(): TurnoEstado {
    return this.turnosService.estado(this.turno);
  }

  getNombreJaula(): string {
    if (!this.turno.cabecera.jaula) return 'N/A';
    return this.turno.cabecera.jaula.nombre;
  }
  
  // Obtener la hora actual en formato HH:mm
  private getHoraActual(): string {
    return nowHHmm();
  }

  abrirDialogoIniciar(): void {
    const dialogRef = this.dialog.open(IniciarRecepcionDialog, {
      width: '500px',
      data: {
        turno: this.turno,
        jaulasDisponibles: this.jaulasDisponibles
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        this.iniciarRecepcion(result.jaulaId);
      }
    });
  }

  abrirDialogoFinalizar(): void {
    const dialogRef = this.dialog.open(FinalizarRecepcionDialog, {
      width: '500px',
      data: {
        turno: this.turno,
        nombreJaula: this.getNombreJaula()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finalizarRecepcion();
      }
    });
  }

  verDetalles(): void {
    const dialogRef = this.dialog.open(DetallesRecepcionDialog, {
  width: '800px',
  maxWidth: '90vw',
      data: {
        turno: this.turno,
        nombreJaula: this.getNombreJaula()
      }
    });
  }

  private iniciarRecepcion(jaulaId: number): void {
    try {
      // Obtener el objeto jaula completo
      const jaula = this.jaulasService.getById(jaulaId);
      if (!jaula) {
        console.error(`Jaula con ID ${jaulaId} no encontrada`);
        return;
      }
      
      // Actualizar el turno localmente para mostrar cambio instantáneo
      this.turno.cabecera.jaula = jaula;
      const now = this.getHoraActual();
      
      // Llamar al servicio para persistir los cambios
      this.turnosService.iniciarRecepcion(this.turno.cabecera.idTurno, jaulaId);
      this.turno.cabecera.horaInicioRecepcion = now;

      // Emitir evento al padre
      this.recepcionChanged.emit({
        type: 'iniciada',
        turno: this.turno,
        success: true,
        jaulaId: jaulaId,
        timestamp: now
      });
      
      this.snackBar.open('Recepción iniciada correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } catch (error) {
      // Emitir evento de error al padre
      this.recepcionChanged.emit({
        type: 'iniciada',
        turno: this.turno,
        success: false,
        jaulaId: jaulaId,
        timestamp: this.getHoraActual()
      });
      
      this.snackBar.open('Error al iniciar recepción', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }

  private finalizarRecepcion(): void {
    try {
      
      const now = this.getHoraActual();
      
      // Llamar al servicio para persistir los cambios
      this.turnosService.finalizarRecepcion(this.turno.cabecera.idTurno);
      
      this.turno.cabecera.horaFinRecepcion = now;

      // Emitir evento al padre
      this.recepcionChanged.emit({
        type: 'finalizada',
        turno: this.turno,
        success: true,
        timestamp: now
      });
      
      this.snackBar.open('Recepción finalizada correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } catch (error) {
      // Emitir evento de error al padre
      this.recepcionChanged.emit({
        type: 'finalizada',
        turno: this.turno,
        success: false,
        timestamp: this.getHoraActual()
      });
      
      this.snackBar.open('Error al finalizar recepción', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }
}