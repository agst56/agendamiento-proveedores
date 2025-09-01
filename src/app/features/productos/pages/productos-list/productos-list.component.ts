import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../../../core/services/productos.service';
import { Producto } from '../../../../core/models/producto';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent, SharedModule],
  templateUrl: './productos-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosListComponent {
  term = '';
  readonly items$: Observable<Producto[]>;
  readonly filteredProductos: Observable<Producto[]>;
  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  
  private termSubject = new BehaviorSubject<string>('');

  constructor(private srv: ProductosService) {
    this.items$ = this.srv.list();
    
    this.filteredProductos = combineLatest([
      this.items$,
      this.termSubject.asObservable()
    ]).pipe(
      map(([productos, term]) => 
        productos.filter(p => 
          !term || p.nombre.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  onSearch(v: string) { 
    this.term = v;
    this.termSubject.next(v);
  }

  trackById = (_: number, it: Producto) => it.idProducto;

  remove(id: number) { 
    this.srv.delete(id); 
  }
}
