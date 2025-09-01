import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TurnosRoutingModule } from './turnos-routing.module';
import { ReservaTurnoComponent } from './pages/reserva-turno/reserva-turno.component';

@NgModule({
  imports: [SharedModule, TurnosRoutingModule, ReservaTurnoComponent],
})
export class TurnosModule {}
