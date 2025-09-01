import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecepcionDiaComponent } from './pages/recepcion-dia/recepcion-dia.component';

const routes: Routes = [
  { path: '', component: RecepcionDiaComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class RecepcionRoutingModule {}
