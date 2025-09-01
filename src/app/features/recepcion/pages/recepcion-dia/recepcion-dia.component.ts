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

@Component({
  selector: 'app-recepcion-dia',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private jaulas: JaulasService
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
}
