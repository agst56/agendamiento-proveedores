import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class IdService {
private _id = 1;
next(): number { return this._id++; }
seed(value: number) { this._id = Math.max(this._id, value + 1); }
}