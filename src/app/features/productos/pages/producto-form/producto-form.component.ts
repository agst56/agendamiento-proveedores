import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../../../core/services/productos.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoFormComponent {
  readonly form;
  private _id?: number;

  get id() { return this._id; }

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private srv: ProductosService
  ) {
    this.form = this.fb.nonNullable.group({ 
      nombre: ['', [Validators.required, Validators.minLength(2)]] 
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const it = this.srv.getById(id);
      if (it) { 
        this._id = id; 
        this.form.patchValue({ nombre: it.nombre }); 
      }
    }
  }

  save() {
    const { nombre } = this.form.getRawValue();
    if (!this.form.valid) return;
    
    if (this._id) {
      this.srv.update({ idProducto: this._id, nombre });
    } else {
      this.srv.create(nombre);
    }
    
    this.router.navigate(['/productos']);
  }
}
