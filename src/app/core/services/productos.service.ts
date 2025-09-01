import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Producto } from '../models/producto';
import { IdService } from './id.service';


@Injectable({ providedIn: 'root' })
export class ProductosService {
private readonly _items$ = new BehaviorSubject<Producto[]>([
{ idProducto: 1, nombre: 'Manzana' },
{ idProducto: 2, nombre: 'Naranja' },
{ idProducto: 3, nombre: 'Leche' },
]);
readonly items$ = this._items$.asObservable();


constructor(private ids: IdService) {
this.ids.seed(Math.max(...this._items$.value.map(i => i.idProducto)));
}


list() { return this.items$; }


filteredByName$(term: string) {
const t = term.trim().toLowerCase();
return this.items$.pipe(map(arr => arr.filter(x => x.nombre.toLowerCase().includes(t))));
}


getById(id: number): Producto | undefined {
return this._items$.value.find(x => x.idProducto === id);
}


create(nombre: string): void {
const nuevo: Producto = { idProducto: this.ids.next(), nombre };
this._items$.next([...this._items$.value, nuevo]);
}


update(item: Producto): void {
this._items$.next(this._items$.value.map(x => x.idProducto === item.idProducto ? { ...x, ...item } : x));
}


delete(id: number): void {
this._items$.next(this._items$.value.filter(x => x.idProducto !== id));
}
}