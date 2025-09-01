import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
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
  readonly filteredProveedores: Observable<Proveedor[]>;
  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  
  private termSubject = new BehaviorSubject<string>('');

  constructor(private srv: ProveedoresService) {
    this.proveedores$ = this.srv.list();
    
    this.filteredProveedores = combineLatest([
      this.proveedores$,
      this.termSubject.asObservable()
    ]).pipe(
      map(([proveedores, term]) => 
        proveedores.filter(p => 
          !term || p.nombre.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  onSearch(value: string) { 
    this.term = value;
    this.termSubject.next(value);
  }

  trackById = (_: number, it: Proveedor) => it.idProveedor;

  remove(id: number) { 
    this.srv.delete(id); 
  }
}
