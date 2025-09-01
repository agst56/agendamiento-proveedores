import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Turno, TurnoCabecera, TurnoDetalle, TurnoEstado } from '../models/turno';
import { IdService } from './id.service';
import { JaulasService } from './jaulas.service';
import { ProveedoresService } from './proveedores.service';
import { ProductosService } from './productos.service';
import { CookieStorageService } from './cookie-storage.service';
import { nowHHmm } from '../utils/time';

@Injectable({ providedIn: 'root' })
export class TurnosService {
  private readonly STORAGE_KEY = 'turnos';
  private readonly _items$ = new BehaviorSubject<Turno[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(
    private ids: IdService, 
    private jaulas: JaulasService, 
    private proveedores: ProveedoresService,
    private productos: ProductosService,
    private storage: CookieStorageService
  ) {
    this.loadFromStorage();
    const currentItems = this._items$.value;
    if (currentItems.length > 0) {
      this.ids.seed(Math.max(...currentItems.map(i => i.cabecera.idTurno)));
    }
  }

  private loadFromStorage(): void {
    const items = this.storage.loadFromStorage<any>(this.STORAGE_KEY);
    // Migrar datos antiguos al nuevo formato si es necesario
    const migratedItems = items.map(item => this.migrateToNewFormat(item));
    this._items$.next(migratedItems);
  }

  private migrateToNewFormat(turno: any): Turno {
    // Si el turno ya tiene el nuevo formato, devolverlo tal como está
    if (turno.cabecera.proveedor && typeof turno.cabecera.proveedor === 'object') {
      return turno;
    }

    // Migrar formato antiguo al nuevo
    const proveedor = this.proveedores.getById(turno.cabecera.idProveedor);
    if (!proveedor) {
      console.warn(`Proveedor con ID ${turno.cabecera.idProveedor} no encontrado durante la migración`);
      return turno; // Devolver sin migrar si no se encuentra el proveedor
    }

    let jaula = null;
    if (turno.cabecera.idJaula) {
      jaula = this.jaulas.getById(turno.cabecera.idJaula);
    }

    const detallesMigrados = turno.detalles.map((detalle: any) => {
      if (detalle.producto && typeof detalle.producto === 'object') {
        return detalle; // Ya está migrado
      }
      
      const producto = this.productos.getById(detalle.idProducto);
      if (!producto) {
        console.warn(`Producto con ID ${detalle.idProducto} no encontrado durante la migración`);
        return detalle; // Devolver sin migrar si no se encuentra el producto
      }
      
      return {
        idTurno: detalle.idTurno,
        producto,
        cantidad: detalle.cantidad
      };
    });

    return {
      cabecera: {
        idTurno: turno.cabecera.idTurno,
        fecha: turno.cabecera.fecha,
        horaInicioAgendamiento: turno.cabecera.horaInicioAgendamiento,
        horaFinAgendamiento: turno.cabecera.horaFinAgendamiento,
        proveedor,
        jaula,
        horaInicioRecepcion: turno.cabecera.horaInicioRecepcion,
        horaFinRecepcion: turno.cabecera.horaFinRecepcion
      },
      detalles: detallesMigrados
    };
  }

  private saveToStorage(): void {
    console.log("saving to storage")
    this.storage.saveToStorage(this.STORAGE_KEY, this._items$.value);
  }

  list() { 
    return this.items$; 
  }

  getById(id: number): Turno | undefined {
    return this._items$.value.find(x => x.cabecera.idTurno === id);
  }

  create(
    fecha: string,
    horaInicioAgendamiento: string,
    horaFinAgendamiento: string,
    idProveedor: number,
    detalles: { idProducto: number; cantidad: number }[]
  ): number {
    const proveedor = this.proveedores.getById(idProveedor);
    if (!proveedor) {
      throw new Error(`Proveedor con ID ${idProveedor} no encontrado`);
    }

    const idTurno = this.ids.next();
    const cabecera: TurnoCabecera = {
      idTurno,
      fecha,
      horaInicioAgendamiento,
      horaFinAgendamiento,
      proveedor,
      jaula: null,
      horaInicioRecepcion: null,
      horaFinRecepcion: null,
    };
    
    const dets: TurnoDetalle[] = detalles.map(d => {
      const producto = this.productos.getById(d.idProducto);
      if (!producto) {
        throw new Error(`Producto con ID ${d.idProducto} no encontrado`);
      }
      return { idTurno, producto, cantidad: d.cantidad };
    });
    
    const nuevo: Turno = { cabecera, detalles: dets };
    this._items$.next([...this._items$.value, nuevo]);
    this.saveToStorage();
    return idTurno;
  }

  createReserva(
    fecha: string,
    horaInicioAgendamiento: string,
    horaFinAgendamiento: string,
    idProveedor: number,
    detalles: { idProducto: number; cantidad: number }[]
  ): number {
    return this.create(fecha, horaInicioAgendamiento, horaFinAgendamiento, idProveedor, detalles);
  }

  byDateSnapshot(fecha: string): Turno[] {
    return this._items$.value
      .filter(t => t.cabecera.fecha === fecha)
      .sort((a, b) => a.cabecera.horaInicioAgendamiento.localeCompare(b.cabecera.horaInicioAgendamiento));
  }

  estado(t: Turno): TurnoEstado {
    const c = t.cabecera;
    if (c.horaFinRecepcion) return 'completado';
    if (c.horaInicioRecepcion) return 'en recepcion';
    return 'pendiente';
  }

  iniciarRecepcion(idTurno: number, idJaula: number): void {
    const items = this._items$.value;
    const idx = items.findIndex(t => t.cabecera.idTurno === idTurno);
    if (idx < 0) return;
    const t = items[idx];
    console.log(JSON.stringify(t))
    
    if (t.cabecera.horaInicioRecepcion){
        console.warn(`No se puede iniciar recepción para turno ${idTurno}. Estado actual: ${this.estado(t)}`);
        return;
    }
        console.log("asqea")


    // Validar que el turno esté en estado pendiente
    if (!this.puedeIniciarRecepcion(t)) {
      console.warn(`No se puede iniciar recepción para turno ${idTurno}. Estado actual: ${this.estado(t)}`);
      return;
    }
        console.log("aasqsffff")

    
    // validar jaula libre
    const jaula = this.jaulas.getById(idJaula);
        console.log("aagwerjnwerjk")
    console.log(JSON.stringify(jaula))
    if (!jaula || jaula.enUso === 'S') return;
    console.log("aaqwkjrnkjqg")

    const modCab = { ...t.cabecera, jaula, horaInicioRecepcion: nowHHmm() };
        console.log("aaqwrnqvvvv")

    const modTurno: Turno = { ...t, cabecera: modCab };
    console.log("aaddddqwwwww")

    const next = [...items];
    console.log("aa")
    next[idx] = modTurno;
    console.log("aab")
    this._items$.next(next);
    console.log("aabc")
    this.saveToStorage();
console.log("aadsq")
    this.jaulas.setEnUso(idJaula, 'S');
  }

  finalizarRecepcion(idTurno: number): void {
    const items = this._items$.value;
    const idx = items.findIndex(t => t.cabecera.idTurno === idTurno);
    if (idx < 0) return;
    const t = items[idx];

    // Validar que el turno esté en estado 'en recepcion'
    if (!this.puedeFinalizarRecepcion(t)) {
      console.warn(`No se puede finalizar recepción para turno ${idTurno}. Estado actual: ${this.estado(t)}`);
      return;
    }

    const idJaula = t.cabecera.jaula?.idJaula ?? undefined;
    const modCab = { ...t.cabecera, horaFinRecepcion: nowHHmm() };
    const modTurno: Turno = { ...t, cabecera: modCab };

    const next = [...items];
    next[idx] = modTurno;
    this._items$.next(next);
    this.saveToStorage();

    if (idJaula) this.jaulas.setEnUso(idJaula, 'N');
  }

  /**
   * Métodos utilitarios para validar estados y acciones
   */
  puedeIniciarRecepcion(turno: Turno): boolean {
    return this.estado(turno) === 'pendiente';
  }

  puedeFinalizarRecepcion(turno: Turno): boolean {
    return this.estado(turno) === 'en recepcion';
  }

  estaCompletado(turno: Turno): boolean {
    return this.estado(turno) === 'completado';
  }

  /**
   * Obtiene todos los turnos por estado
   */
  turnosPorEstado(estado: TurnoEstado): Turno[] {
    return this._items$.value.filter(t => this.estado(t) === estado);
  }

  /**
   * Obtiene estadísticas de turnos para una fecha específica
   */
  estadisticasPorFecha(fecha: string): { pendientes: number; enRecepcion: number; completados: number } {
    const turnosFecha = this.byDateSnapshot(fecha);
    return {
      pendientes: turnosFecha.filter(t => this.estado(t) === 'pendiente').length,
      enRecepcion: turnosFecha.filter(t => this.estado(t) === 'en recepcion').length,
      completados: turnosFecha.filter(t => this.estado(t) === 'completado').length
    };
  }

  clearAll(): void {
    this._items$.next([]);
    this.saveToStorage();
  }
}