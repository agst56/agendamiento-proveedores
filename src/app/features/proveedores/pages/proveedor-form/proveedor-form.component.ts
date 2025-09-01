import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../../../../core/services/proveedores.service';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './proveedor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProveedorFormComponent {
  readonly form;
  private _id?: number;

  get id() { return this._id; }

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private srv: ProveedoresService
  ) {
    this.form = this.fb.nonNullable.group({ 
      nombre: ['', [Validators.required, Validators.minLength(2)]] 
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const p = this.srv.getById(id);
      if (p) { 
        this._id = id; 
        this.form.patchValue({ nombre: p.nombre }); 
      }
    }
  }

  save() {
    const { nombre } = this.form.getRawValue();
    if (!this.form.valid) return;
    
    if (this._id) {
      this.srv.update({ idProveedor: this._id, nombre });
    } else {
      this.srv.create(nombre);
    }
    
    this.router.navigate(['/proveedores']);
  }
}
