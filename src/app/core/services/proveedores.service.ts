import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Proveedor } from '../models/proveedor';
import { IdService } from './id.service';


@Injectable({ providedIn: 'root' })
export class ProveedoresService {
private readonly _items$ = new BehaviorSubject<Proveedor[]>([
{ idProveedor: 1, nombre: 'Acme S.A.' },
{ idProveedor: 2, nombre: 'LogiPack SRL' },
{ idProveedor: 3, nombre: 'Frutalia' },
]);


readonly items$ = this._items$.asObservable();


constructor(private ids: IdService) {
this.ids.seed(Math.max(...this._items$.value.map(i => i.idProveedor)));
}


list() { return this.items$; }


filteredByName$(term: string) {
const t = term.trim().toLowerCase();
return this.items$.pipe(map(arr => arr.filter(x => x.nombre.toLowerCase().includes(t))));
}


getById(id: number): Proveedor | undefined {
return this._items$.value.find(x => x.idProveedor === id);
}


create(nombre: string): void {
const nuevo: Proveedor = { idProveedor: this.ids.next(), nombre };
this._items$.next([...this._items$.value, nuevo]);
}


update(item: Proveedor): void {
this._items$.next(this._items$.value.map(x => x.idProveedor === item.idProveedor ? { ...x, ...item } : x));
}


delete(id: number): void {
this._items$.next(this._items$.value.filter(x => x.idProveedor !== id));
}
}