import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Producto } from '../models/producto';
import { IdService } from './id.service';
import { CookieStorageService } from './cookie-storage.service';


@Injectable({ providedIn: 'root' })
export class ProductosService {
private readonly STORAGE_KEY = 'productos';
private readonly _items$ = new BehaviorSubject<Producto[]>([]);
readonly items$ = this._items$.asObservable();


constructor(private ids: IdService, private storage: CookieStorageService) {
this.loadFromStorage();
const currentItems = this._items$.value;
if (currentItems.length > 0) {
this.ids.seed(Math.max(...currentItems.map(i => i.idProducto)));
}
}

private loadFromStorage(): void {
const items = this.storage.loadFromStorage<Producto>(this.STORAGE_KEY);
this._items$.next(items);
}

private saveToStorage(): void {
this.storage.saveToStorage(this.STORAGE_KEY, this._items$.value);
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
this.saveToStorage();
}


update(item: Producto): void {
this._items$.next(this._items$.value.map(x => x.idProducto === item.idProducto ? { ...x, ...item } : x));
this.saveToStorage();
}


delete(id: number): void {
this._items$.next(this._items$.value.filter(x => x.idProducto !== id));
this.saveToStorage();
}

clearAll(): void {
this._items$.next([]);
this.saveToStorage();
}
}