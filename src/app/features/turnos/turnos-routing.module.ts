import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservaTurnoComponent } from './pages/reserva-turno/reserva-turno.component';

const routes: Routes = [
  { path: '', component: ReservaTurnoComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class TurnosRoutingModule {}
