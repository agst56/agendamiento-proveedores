import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { EnUso, Jaula } from '../models/jaula';
import { IdService } from './id.service';


@Injectable({ providedIn: 'root' })
export class JaulasService {
private readonly _items$ = new BehaviorSubject<Jaula[]>([
{ idJaula: 1, nombre: 'J-01', enUso: 'N' },
{ idJaula: 2, nombre: 'J-02', enUso: 'N' },
{ idJaula: 3, nombre: 'J-03', enUso: 'N' },
]);
readonly items$ = this._items$.asObservable();


constructor(private ids: IdService) {
this.ids.seed(Math.max(...this._items$.value.map(i => i.idJaula)));
}


list() { return this.items$; }


filteredByName$(term: string) {
const t = term.trim().toLowerCase();
return this.items$.pipe(map(arr => arr.filter(x => x.nombre.toLowerCase().includes(t))));
}


getById(id: number): Jaula | undefined { return this._items$.value.find(x => x.idJaula === id); }


create(nombre: string, enUso: EnUso = 'N'): void {
const nuevo: Jaula = { idJaula: this.ids.next(), nombre, enUso };
this._items$.next([...this._items$.value, nuevo]);
}


update(item: Jaula): void {
this._items$.next(this._items$.value.map(x => x.idJaula === item.idJaula ? { ...x, ...item } : x));
}


delete(id: number): void {
this._items$.next(this._items$.value.filter(x => x.idJaula !== id));
}


setEnUso(idJaula: number, enUso: EnUso): void {
this._items$.next(this._items$.value.map(j => j.idJaula === idJaula ? { ...j, enUso } : j));
}


libresSnapshot(): Jaula[] { return this._items$.value.filter(j => j.enUso === 'N'); }

allSnapshot(): Jaula[] { return this._items$.value; }
}