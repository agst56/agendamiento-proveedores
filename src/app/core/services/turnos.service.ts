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
    if (c.horaFinRecepcion) return 'FINALIZADO';
    if (c.horaInicioRecepcion) return 'EN_RECEPCION';
    return 'PENDIENTE';
  }

  iniciarRecepcion(idTurno: number, idJaula: number): void {
    const items = this._items$.value;
    const idx = items.findIndex(t => t.cabecera.idTurno === idTurno);
    if (idx < 0) return;
    const t = items[idx];
    if (t.cabecera.horaInicioRecepcion) return; // ya iniciado
    
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

    const idJaula = t.cabecera.idJaula ?? undefined;
    const modCab = { ...t.cabecera, horaFinRecepcion: nowHHmm() };
    const modTurno: Turno = { ...t, cabecera: modCab };

    const next = [...items];
    next[idx] = modTurno;
    this._items$.next(next);

    if (idJaula) this.jaulas.setEnUso(idJaula, 'N');
  }
}