import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresListComponent } from './pages/proveedores-list/proveedores-list.component';
import { ProveedorFormComponent } from './pages/proveedor-form/proveedor-form.component';

const routes: Routes = [
  { path: '', component: ProveedoresListComponent },
  { path: 'nuevo', component: ProveedorFormComponent },
  { path: ':id', component: ProveedorFormComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class ProveedoresRoutingModule {}