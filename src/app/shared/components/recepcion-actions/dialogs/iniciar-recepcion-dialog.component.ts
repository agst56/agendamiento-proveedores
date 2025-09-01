import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface IniciarRecepcionData {
  turno: any;
  jaulasDisponibles: any[];
}

@Component({
  selector: 'app-iniciar-recepcion-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>play_arrow</mat-icon>
      Iniciar Recepción
    </h2>
    
    <mat-dialog-content>
      <div class="dialog-content">
        <p>Configure la recepción del turno:</p>
        
        <div class="info-section">
          <div class="info-item">
            <strong>Proveedor ID:</strong> {{ data.turno.cabecera?.idProveedor || 'N/A' }}
          </div>
          <div class="info-item">
            <strong>Fecha:</strong> {{ data.turno.cabecera?.fecha || 'N/A' }}
          </div>
          <div class="info-item">
            <strong>Hora programada:</strong> 
            {{ data.turno.cabecera?.horaInicioAgendamiento || 'N/A' }} - 
            {{ data.turno.cabecera?.horaFinAgendamiento || 'N/A' }}
          </div>
        </div>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Seleccionar jaula</mat-label>
          <mat-select [(ngModel)]="jaulaSeleccionada" [disabled]="!data.jaulasDisponibles.length">
            <mat-option value="">Seleccione una jaula</mat-option>
            <mat-option *ngFor="let jaula of data.jaulasDisponibles" [value]="jaula.idJaula">
              {{ jaula.nombre }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        
        <div class="warning">
          <mat-icon>warning</mat-icon>
          <span>Esta acción marcará el inicio del proceso de recepción y asignará la jaula seleccionada.</span>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        <mat-icon>cancel</mat-icon>
        Cancelar
      </button>
      <button 
        mat-raised-button 
        color="primary" 
        [disabled]="!jaulaSeleccionada"
        (click)="onConfirm()">
        <mat-icon>play_arrow</mat-icon>
        Iniciar Recepción
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      min-width: 400px;
      padding: 16px 0;
    }
    
    .info-section {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    
    .info-item {
      margin-bottom: 8px;
    }
    
    .info-item:last-child {
      margin-bottom: 0;
    }
    
    .full-width {
      width: 100%;
      margin: 16px 0;
    }
    
    .warning {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff3cd;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid #ffc107;
      margin-top: 16px;
    }
    
    .warning mat-icon {
      color: #856404;
    }
    
    .warning span {
      color: #856404;
      font-size: 0.9rem;
    }
    
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class IniciarRecepcionDialog {
  jaulaSeleccionada = '';

  constructor(
    public dialogRef: MatDialogRef<IniciarRecepcionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IniciarRecepcionData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.jaulaSeleccionada) {
      this.dialogRef.close({
        confirmed: true,
        jaulaId: Number(this.jaulaSeleccionada)
      });
    }
  }
}
