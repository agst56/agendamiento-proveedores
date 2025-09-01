import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { JaulasRoutingModule } from './jaulas-routing.module';
import { JaulasListComponent } from './pages/jaulas-list/jaulas-list.component';
import { JaulaFormComponent } from './pages/jaula-form/jaula-form.component';

@NgModule({
  imports: [SharedModule, JaulasRoutingModule, JaulasListComponent, JaulaFormComponent],
})
export class JaulasModule {}
