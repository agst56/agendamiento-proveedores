import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosService } from '../../../core/services/turnos.service';

@Component({
  selector: 'app-estados-resumen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="estados-resumen">
      <h3>📊 Resumen del día: {{ fecha }}</h3>
      <div class="stats-grid">
        <div class="stat-card pendiente">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.pendientes }}</div>
            <div class="stat-label">Pendientes</div>
          </div>
        </div>
        
        <div class="stat-separator">|</div>
        
        <div class="stat-card en-recepcion">
          <div class="stat-icon">🔄</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.enRecepcion }}</div>
            <div class="stat-label">En Recepción</div>
          </div>
        </div>
        
        <div class="stat-separator">|</div>
        
        <div class="stat-card completado">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.completados }}</div>
            <div class="stat-label">Completados</div>
          </div>
        </div>
      </div>
      
      <div class="progress-section">
        <div class="progress-label">Progreso del día:</div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
        </div>
        <div class="progress-text">{{ getProgressPercentage().toFixed(0) }}% completado</div>
      </div>
    </div>
  `,
  styles: [`
    .estados-resumen {
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
      border: 1px solid #dee2e6;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .estados-resumen h3 {
      margin: 0 0 16px 0;
      color: #495057;
      font-size: 18px;
      font-weight: 600;
    }

    .stats-grid {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 10px;
      min-width: 140px;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-card.pendiente {
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
      border: 1px solid #ffeaa7;
    }

    .stat-card.en-recepcion {
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
      border: 1px solid #bee5eb;
    }

    .stat-card.completado {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border: 1px solid #c3e6cb;
    }

    .stat-icon {
      font-size: 24px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      line-height: 1;
    }

    .stat-card.pendiente .stat-number {
      color: #856404;
    }

    .stat-card.en-recepcion .stat-number {
      color: #0c5460;
    }

    .stat-card.completado .stat-number {
      color: #155724;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6c757d;
      margin-top: 2px;
    }

    .stat-separator {
      color: #dee2e6;
      font-size: 20px;
      font-weight: bold;
    }

    .progress-section {
      border-top: 1px solid #e9ecef;
      padding-top: 16px;
    }

    .progress-label {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #17a2b8 0%, #28a745 100%);
      transition: width 0.5s ease;
    }

    .progress-text {
      font-size: 12px;
      color: #6c757d;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        flex-direction: column;
      }
      
      .stat-separator {
        display: none;
      }
      
      .stat-card {
        min-width: 200px;
        justify-content: center;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstadosResumenComponent {
  @Input() fecha!: string;

  constructor(private turnosService: TurnosService) {}

  get stats() {
    return this.turnosService.estadisticasPorFecha(this.fecha);
  }

  getProgressPercentage(): number {
    const total = this.stats.pendientes + this.stats.enRecepcion + this.stats.completados;
    if (total === 0) return 0;
    return (this.stats.completados / total) * 100;
  }
}
