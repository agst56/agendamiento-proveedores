import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../../../core/services/productos.service';
import { Producto } from '../../../../core/models/producto';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  templateUrl: './productos-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductosListComponent {
  term = '';
  readonly items$: Observable<Producto[]>;

  constructor(private srv: ProductosService) {
    this.items$ = this.srv.list();
  }

  onSearch(v: string) { 
    this.term = v; 
  }

  trackById = (_: number, it: Producto) => it.idProducto;

  remove(id: number) { 
    this.srv.delete(id); 
  }
}
