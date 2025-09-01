import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosListComponent } from './pages/productos-list/productos-list.component';
import { ProductoFormComponent } from './pages/producto-form/producto-form.component';

@NgModule({
  imports: [SharedModule, ProductosRoutingModule, ProductosListComponent, ProductoFormComponent],
})
export class ProductosModule {}
