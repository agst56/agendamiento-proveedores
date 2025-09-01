import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RecepcionRoutingModule } from './recepcion-routing.module';
import { RecepcionDiaComponent } from './pages/recepcion-dia/recepcion-dia.component';

@NgModule({
  imports: [SharedModule, RecepcionRoutingModule, RecepcionDiaComponent],
})
export class RecepcionModule {}
