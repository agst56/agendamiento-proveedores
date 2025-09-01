import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JaulasService } from '../../../../core/services/jaulas.service';

@Component({
  selector: 'app-jaula-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './jaula-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JaulaFormComponent {
  readonly form;
  private _id?: number;

  get id() { return this._id; }

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private srv: JaulasService
  ) {
    this.form = this.fb.nonNullable.group({ 
      nombre: ['', [Validators.required, Validators.minLength(1)]], 
      enUso: ['N' as 'N' | 'S']
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const it = this.srv.getById(id);
      if (it) { 
        this._id = id; 
        this.form.patchValue(it); 
      }
    }
  }

  save() {
    const { nombre, enUso } = this.form.getRawValue();
    if (!this.form.valid) return;
    
    if (this._id) {
      this.srv.update({ idJaula: this._id, nombre, enUso });
    } else {
      this.srv.create(nombre, enUso);
    }
    
    this.router.navigate(['/jaulas']);
  }
}
