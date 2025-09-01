import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JaulasListComponent } from './pages/jaulas-list/jaulas-list.component';
import { JaulaFormComponent } from './pages/jaula-form/jaula-form.component';

const routes: Routes = [
  { path: '', component: JaulasListComponent },
  { path: 'nuevo', component: JaulaFormComponent },
  { path: ':id', component: JaulaFormComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule] 
})
export class JaulasRoutingModule {}
