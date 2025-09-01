import { Proveedor } from './proveedor';
import { Jaula } from './jaula';
import { Producto } from './producto';

export interface TurnoCabecera {
idTurno: number;
fecha: string; // ISO (yyyy-mm-dd)
horaInicioAgendamiento: string; // HH:mm
horaFinAgendamiento: string; // HH:mm
proveedor: Proveedor;
jaula?: Jaula | null; // asignada durante la recepción
horaInicioRecepcion?: string | null; // HH:mm
horaFinRecepcion?: string | null; // HH:mm
}


export interface TurnoDetalle {
idTurno: number;
producto: Producto;
cantidad: number;
}


export interface Turno {
cabecera: TurnoCabecera;
detalles: TurnoDetalle[];
}


export type TurnoEstado = 'pendiente' | 'en recepcion' | 'completado';