import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { EnUso, Jaula } from '../models/jaula';
import { IdService } from './id.service';
import { CookieStorageService } from './cookie-storage.service';


@Injectable({ providedIn: 'root' })
export class JaulasService {
private readonly STORAGE_KEY = 'jaulas';
private readonly _items$ = new BehaviorSubject<Jaula[]>([]);
readonly items$ = this._items$.asObservable();


constructor(private ids: IdService, private storage: CookieStorageService) {
this.loadFromStorage();
const currentItems = this._items$.value;
if (currentItems.length > 0) {
this.ids.seed(Math.max(...currentItems.map(i => i.idJaula)));
}
}

private loadFromStorage(): void {
const items = this.storage.loadFromStorage<Jaula>(this.STORAGE_KEY);
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


getById(id: number): Jaula | undefined { return this._items$.value.find(x => x.idJaula === id); }


create(nombre: string, enUso: EnUso = 'N'): void {
const nuevo: Jaula = { idJaula: this.ids.next(), nombre, enUso };
this._items$.next([...this._items$.value, nuevo]);
this.saveToStorage();
}


update(item: Jaula): void {
this._items$.next(this._items$.value.map(x => x.idJaula === item.idJaula ? { ...x, ...item } : x));
this.saveToStorage();
}


delete(id: number): void {
this._items$.next(this._items$.value.filter(x => x.idJaula !== id));
this.saveToStorage();
}


setEnUso(idJaula: number, enUso: EnUso): void {
this._items$.next(this._items$.value.map(j => j.idJaula === idJaula ? { ...j, enUso } : j));
this.saveToStorage();
}

clearAll(): void {
this._items$.next([]);
this.saveToStorage();
}


libresSnapshot(): Jaula[] { return this._items$.value.filter(j => j.enUso === 'N'); }

allSnapshot(): Jaula[] { return this._items$.value; }
}