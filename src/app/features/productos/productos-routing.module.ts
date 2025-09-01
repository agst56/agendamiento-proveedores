import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosListComponent } from './pages/productos-list/productos-list.component';
import { ProductoFormComponent } from './pages/producto-form/producto-form.component';

const routes: Routes = [
  { path: '', component: ProductosListComponent },
  { path: 'nuevo', component: ProductoFormComponent },
  { path: ':id', component: ProductoFormComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class ProductosRoutingModule {}
