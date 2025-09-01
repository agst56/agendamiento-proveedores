import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface FinalizarRecepcionData {
  turno: any;
  nombreJaula: string;
}

@Component({
  selector: 'app-finalizar-recepcion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>stop</mat-icon>
      Confirmar Finalización de Recepción
    </h2>
    
    <mat-dialog-content>
      <div class="dialog-content">
        <p>¿Está seguro que desea finalizar la recepción del turno?</p>
        
        <div class="info-section">
          <div class="info-item">
            <strong>Proveedor:</strong> {{ data.turno.cabecera?.proveedor?.nombre || 'N/A' }}
          </div>
          <div class="info-item">
            <strong>Jaula utilizada:</strong> {{ data.nombreJaula }}
          </div>
          <div class="info-item">
            <strong>Inicio de recepción:</strong> {{ data.turno.cabecera?.horaInicioRecepcion || 'N/A' }}
          </div>
        </div>
        
        <div class="warning">
          <mat-icon>info</mat-icon>
          <span>Esta acción finalizará el proceso de recepción y liberará la jaula asignada.</span>
        </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        <mat-icon>cancel</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        <mat-icon>stop</mat-icon>
        Finalizar Recepción
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      min-width: 350px;
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
    
    .warning {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e7f3ff;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
      margin-top: 16px;
    }
    
    .warning mat-icon {
      color: #1976d2;
    }
    
    .warning span {
      color: #1976d2;
      font-size: 0.9rem;
    }
    
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class FinalizarRecepcionDialog {
  constructor(
    public dialogRef: MatDialogRef<FinalizarRecepcionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FinalizarRecepcionData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
