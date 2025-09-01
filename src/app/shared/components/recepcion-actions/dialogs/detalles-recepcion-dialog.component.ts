import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

export interface DetallesRecepcionData {
  turno: any;
  nombreJaula: string;
}

@Component({
  selector: 'app-detalles-recepcion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>visibility</mat-icon>
      Detalles de Recepción
    </h2>
    
    <mat-dialog-content>
      <div class="dialog-content">
        
        <!-- Información General -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Información General</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Proveedor ID:</span>
                <span class="value">{{ data.turno.cabecera?.idProveedor || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Fecha:</span>
                <span class="value">{{ data.turno.cabecera?.fecha || 'N/A' }}</span>
              </div>
            
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tiempos -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Tiempos de Recepción</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Programado:</span>
                <span class="value">{{ data.turno.cabecera?.horaInicioAgendamiento || 'N/A' }} - {{ data.turno.cabecera?.horaFinAgendamiento || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Inicio recepción:</span>
                <span class="value">{{ data.turno.cabecera?.horaInicioRecepcion || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Fin recepción:</span>
                <span class="value">{{ data.turno.cabecera?.horaFinRecepcion || 'N/A' }}</span>
              </div>
            
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Productos -->
        <mat-card class="info-card" *ngIf="data.turno.detalles && data.turno.detalles.length > 0">
          <mat-card-header>
            <mat-card-title>Productos Recibidos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="productos-list">
              <div *ngFor="let detalle of data.turno.detalles" class="producto-item">
                <mat-icon>inventory</mat-icon>
                <span class="producto-nombre">Producto ID {{ detalle.idProducto }}</span>
                <span class="producto-cantidad">{{ detalle.cantidad || 0 }} unidades</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Estado -->
        <div class="status-section" *ngIf="data.turno.cabecera?.horaFinRecepcion">
          <div class="status-badge completado">
            <mat-icon>check_circle</mat-icon>
            <span>RECEPCIÓN COMPLETADA</span>
          </div>
        </div>
        
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="onClose()">
        <mat-icon>close</mat-icon>
        Cerrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
  min-width: 720px;
  max-width: 900px;
      padding: 16px 0;
    }
    
    .info-card {
      margin-bottom: 16px;
      border-radius: 8px;
    }
    
    .info-grid {
      display: grid;
      gap: 12px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
      color: var(--mat-theme-on-surface-variant);
    }
    
    .value {
      font-weight: 400;
      color: var(--mat-theme-on-surface);
    }
    
    .productos-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .producto-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .producto-nombre {
      flex: 1;
      font-weight: 500;
    }
    
    .producto-cantidad {
      font-size: 0.875rem;
      color: var(--mat-theme-on-surface-variant);
    }
    
    .status-section {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }
    
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 24px;
      font-weight: 500;
    }
    
    .status-badge.completado {
      background: #d4edda;
      color: #155724;
    }
    
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DetallesRecepcionDialog {
  constructor(
    public dialogRef: MatDialogRef<DetallesRecepcionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DetallesRecepcionData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

}
