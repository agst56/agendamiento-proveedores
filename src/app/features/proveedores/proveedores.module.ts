import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedoresListComponent } from './pages/proveedores-list/proveedores-list.component';
import { ProveedorFormComponent } from './pages/proveedor-form/proveedor-form.component';

@NgModule({
  imports: [SharedModule, ProveedoresRoutingModule, ProveedoresListComponent, ProveedorFormComponent],
})
export class ProveedoresModule {}
