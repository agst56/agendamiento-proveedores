import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TIME_SLOTS } from '../../../../core/utils/time-slots';
import { isEndAfterStart } from '../../../../core/utils/time';
import { ProveedoresService } from '../../../../core/services/proveedores.service';
import { ProductosService } from '../../../../core/services/productos.service';
import { TurnosService } from '../../../../core/services/turnos.service';
import { Proveedor } from '../../../../core/models/proveedor';
import { Producto } from '../../../../core/models/producto';

@Component({
  selector: 'app-reserva-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reserva-turno.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservaTurnoComponent {
  readonly timeSlots = TIME_SLOTS;
  readonly proveedores$: Observable<Proveedor[]>;
  readonly productos$: Observable<Producto[]>;
  readonly form;

  get detallesFA() { 
    return this.form.controls.detalles as FormArray; 
  }

  constructor(
    private fb: FormBuilder, 
    private proveedores: ProveedoresService,
    private productos: ProductosService, 
    private turnos: TurnosService, 
    private router: Router
  ) {
    this.proveedores$ = this.proveedores.list();
    this.productos$ = this.productos.list();
    
    this.form = this.fb.nonNullable.group({
      fecha: ['', Validators.required],
      horaInicioAgendamiento: ['', Validators.required],
      horaFinAgendamiento: ['', Validators.required],
      idProveedor: [0, Validators.required],
      detalles: this.fb.array([] as any[]),
    });

    this.addDetalle();
  }

  addDetalle() {
    const g = this.fb.nonNullable.group({ 
      idProducto: [0, Validators.min(1)],
      cantidad: [1, [Validators.required, Validators.min(1)]] 
    });
    this.detallesFA.push(g);
  }

  removeDetalle(i: number) { 
    this.detallesFA.removeAt(i); 
  }

  save() {
    const v = this.form.getRawValue();
    if (!this.form.valid) return;
    if (!isEndAfterStart(v.horaInicioAgendamiento, v.horaFinAgendamiento)) return;
    
    const dets = v.detalles
      .map((d: any) => ({ idProducto: Number(d.idProducto), cantidad: Number(d.cantidad) }))
      .filter((d: any) => d.idProducto > 0 && d.cantidad > 0);
    
    if (!dets.length) return;
    
    this.turnos.createReserva(v.fecha, v.horaInicioAgendamiento, v.horaFinAgendamiento, Number(v.idProveedor), dets);
    this.router.navigate(['/recepcion']);
  }
}
