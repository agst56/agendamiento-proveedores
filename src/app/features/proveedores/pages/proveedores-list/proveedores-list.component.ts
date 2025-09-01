import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { Proveedor } from '../../../../core/models/proveedor';
import { ProveedoresService } from '../../../../core/services/proveedores.service';

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './proveedores-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProveedoresListComponent {
  term = '';
  readonly proveedores$: Observable<Proveedor[]>;

  constructor(private srv: ProveedoresService) {
    const term$ = new Observable<string>(obs => {
      obs.next('');
    }).pipe(startWith(''));

    // Simpler: filtrar sobre el estado actual cada vez que cambia term (via (valueChange))
    this.proveedores$ = this.srv.list();
  }

  onSearch(value: string) { 
    this.term = value; 
  }

  trackById = (_: number, it: Proveedor) => it.idProveedor;

  remove(id: number) { 
    this.srv.delete(id); 
  }
}
