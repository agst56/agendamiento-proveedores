import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { TurnosService } from '../../../../core/services/turnos.service';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { ProductosService } from '../../../../core/services/productos.service';
import { JaulasService } from '../../../../core/services/jaulas.service';
import { Turno } from '../../../../core/models/turno';
import { Proveedor } from '../../../../core/models/proveedor';
import { Producto } from '../../../../core/models/producto';
import { Jaula } from '../../../../core/models/jaula';
import { RecepcionActionsComponent, RecepcionChangeEvent } from '../../../../shared/components/recepcion-actions/recepcion-actions.component';

@Component({
  selector: 'app-recepcion-dia',
  standalone: true,
  imports: [CommonModule, FormsModule, RecepcionActionsComponent],
  templateUrl: './recepcion-dia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecepcionDiaComponent {
  fecha = new Date().toISOString().slice(0, 10);
  turnos: Turno[] = [];
  expanded: Record<number, boolean> = {};
  jaulaSeleccionada: Record<number, number> = {}; // por turno
  
  readonly proveedores$: Observable<Proveedor[]>;
  readonly productos$: Observable<Producto[]>;
  readonly jaulas$: Observable<Jaula[]>;

  constructor(
    private turnosSrv: TurnosService, 
    private proveedores: ProveedoresService, 
    private productos: ProductosService, 
    public jaulas: JaulasService
  ) {
    this.proveedores$ = this.proveedores.list();
    this.productos$ = this.productos.list();
    this.jaulas$ = this.jaulas.list();
    this.refrescar();
  }

  refrescar() { 
    this.turnos = this.turnosSrv.byDateSnapshot(this.fecha); 
  }

  nombreProveedor(id: number): string {
    const p = this.proveedores.getById(id);
    return p?.nombre || '';
  }

  nombreProducto(id: number): string {
    const p = this.productos.getById(id);
    return p?.nombre || `Producto ${id}`;
  }

  toggle(idTurno: number) { 
    this.expanded[idTurno] = !this.expanded[idTurno]; 
  }

  // Métodos para compatibilidad con el componente RecepcionActions
  getJaulasLibres(): Jaula[] {
    return this.jaulas.libresSnapshot();
  }

  getTodasLasJaulas(): Jaula[] {
    return this.jaulas.allSnapshot();
  }

  iniciar(t: Turno) {
    const libres = this.jaulas.libresSnapshot();
    if (!libres.length) { 
      alert('No hay jaulas libres.'); 
      return; 
    }
    
    const elegido = this.jaulaSeleccionada[t.cabecera.idTurno] || libres[0].idJaula;
    this.turnosSrv.iniciarRecepcion(t.cabecera.idTurno, elegido);
    this.refrescar();
  }

  finalizar(t: Turno) {
    this.turnosSrv.finalizarRecepcion(t.cabecera.idTurno);
    this.refrescar();
  }

  estado(t: Turno) { 
    return this.turnosSrv.estado(t); 
  }

  // Manejar cambios en el estado de recepción
  onRecepcionChanged(event: RecepcionChangeEvent): void {
    if (event.success) {
      // Actualizar la fila específica en la tabla
      const index = this.turnos.findIndex(t => t.cabecera.idTurno === event.turno.cabecera.idTurno);
      if (index >= 0) {
        this.turnos[index] = { ...event.turno };
      }
      
      console.log(`Recepción ${event.type} exitosamente para turno ${event.turno.cabecera.idTurno}`);
      
      // Realizar acciones adicionales según el tipo
      switch (event.type) {
        case 'iniciada':
          console.log(`Turno asignado a jaula ${event.jaulaId}`);
          break;
        case 'finalizada':
          console.log(`Turno completado a las ${event.timestamp}`);
          break;
      }
    } else {
      console.error(`Error en recepción ${event.type} para turno ${event.turno.cabecera.idTurno}`);
      // Refrescar la lista en caso de error para asegurar consistencia
      this.refrescar();
    }
  }
  
  // Extraer solo la parte de la hora de una fecha ISO
  formatHoraDesdeISO(isoString: string | null | undefined): string {
    if (!isoString) return '-';
    
    // Si ya está en formato HH:mm, devolverlo directamente
    if (/^\d{1,2}:\d{1,2}$/.test(isoString)) {
      return isoString;
    }
    
    try {
      // Si es una fecha ISO completa, extraer solo la hora
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString; // Si no es válida, mostrar el string original
      
      const horas = date.getHours().toString().padStart(2, '0');
      const minutos = date.getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    } catch(e) {
      return isoString; // En caso de error, mostrar el string original
    }
  }
}
