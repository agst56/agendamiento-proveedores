import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Turno, TurnoCabecera, TurnoDetalle, TurnoEstado } from '../models/turno';
import { IdService } from './id.service';
import { JaulasService } from './jaulas.service';
import { nowHHmm } from '../utils/time';

@Injectable({ providedIn: 'root' })
export class TurnosService {
  private readonly _items$ = new BehaviorSubject<Turno[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private ids: IdService, private jaulas: JaulasService) {}

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
    const idTurno = this.ids.next();
    const cabecera: TurnoCabecera = {
      idTurno,
      fecha,
      horaInicioAgendamiento,
      horaFinAgendamiento,
      idProveedor,
      idJaula: null,
      horaInicioRecepcion: null,
      horaFinRecepcion: null,
    };
    const dets: TurnoDetalle[] = detalles.map(d => ({ idTurno, ...d }));
    const nuevo: Turno = { cabecera, detalles: dets };
    this._items$.next([...this._items$.value, nuevo]);
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
    return this._items$.value.filter(t => t.cabecera.fecha === fecha);
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
    if (t.cabecera.horaInicioRecepcion) return; // ya iniciado
    
    // Validar que el turno esté en estado pendiente
    if (!this.puedeIniciarRecepcion(t)) {
      console.warn(`No se puede iniciar recepción para turno ${idTurno}. Estado actual: ${this.estado(t)}`);
      return;
    }
    
    // validar jaula libre
    const jaula = this.jaulas.getById(idJaula);
    if (!jaula || jaula.enUso === 'S') return;

    const modCab = { ...t.cabecera, idJaula, horaInicioRecepcion: nowHHmm() };
    const modTurno: Turno = { ...t, cabecera: modCab };

    const next = [...items];
    next[idx] = modTurno;
    this._items$.next(next);

    this.jaulas.setEnUso(idJaula, 'S');
  }

  finalizarRecepcion(idTurno: number): void {
    const items = this._items$.value;
    const idx = items.findIndex(t => t.cabecera.idTurno === idTurno);
    if (idx < 0) return;
    const t = items[idx];
    if (!t.cabecera.horaInicioRecepcion || t.cabecera.horaFinRecepcion) return;

    // Validar que el turno esté en estado 'en recepcion'
    if (!this.puedeFinalizarRecepcion(t)) {
      console.warn(`No se puede finalizar recepción para turno ${idTurno}. Estado actual: ${this.estado(t)}`);
      return;
    }

    const idJaula = t.cabecera.idJaula ?? undefined;
    const modCab = { ...t.cabecera, horaFinRecepcion: nowHHmm() };
    const modTurno: Turno = { ...t, cabecera: modCab };

    const next = [...items];
    next[idx] = modTurno;
    this._items$.next(next);

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
}