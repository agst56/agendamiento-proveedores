import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Jaula } from '../../../../core/models/jaula';
import { JaulasService } from '../../../../core/services/jaulas.service';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-jaulas-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  templateUrl: './jaulas-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JaulasListComponent {
  term = '';
  readonly items$: Observable<Jaula[]>;

  constructor(private srv: JaulasService) {
    this.items$ = this.srv.list();
  }

  onSearch(v: string) { 
    this.term = v; 
  }

  trackById = (_: number, it: Jaula) => it.idJaula;

  remove(id: number) { 
    this.srv.delete(id); 
  }
}
