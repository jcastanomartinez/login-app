import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FacturaService } from '../services/facturaService'; // AJUSTAR
import { Factura, FacturaItem } from '../models/Factura'; // AJUSTAR

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './factura-detalle.html',
  styleUrl: './factura-detalle.scss', // si usas .css, cambia la extensión
})
export class FacturaDetalle implements OnInit { // AJUSTAR el nombre de clase si es otro
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(FacturaService);
  private cdr = inject(ChangeDetectorRef);

  id!: number;
  editando = signal(false);
  guardando = signal(false);
  cargando = signal(true);
  error = signal('');

  estados = ['Pendiente', 'Pagada', 'Anulada'];

  form = this.fb.group({
    invoiceNumber: ['', Validators.required],
    invoiceDate: ['', Validators.required], // yyyy-MM-dd
    estado: ['Pendiente', Validators.required],

    companyName: ['', Validators.required],
    companyTaxId: ['', Validators.required],
    companyAddress: [''],
    companyEmail: ['', Validators.email],

    customerName: ['', Validators.required],
    customerTaxId: [''],
    customerAddress: [''],

    items: this.fb.array([]),
  });

  get items() {
    return this.form.get('items') as FormArray;
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.service.getFacturaById(this.id).subscribe({
      next: (f: Factura) => {
        this.form.patchValue({
          invoiceNumber: f.invoiceNumber,
          invoiceDate: f.invoiceDate?.substring(0, 10),
          estado: f.estado,
          companyName: f.companyName,
          companyTaxId: f.companyTaxId,
          companyAddress: f.companyAddress,
          companyEmail: f.companyEmail,
          customerName: f.customerName,
          customerTaxId: f.customerTaxId,
          customerAddress: f.customerAddress,
        });

        this.items.clear();
        (f.items ?? []).forEach((i) => this.items.push(this.nuevaLinea(i)));

        this.form.disable();
        this.editando.set(false);
        this.error.set('');
        this.cargando.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.error.set('No se pudo cargar la factura.');
        this.cargando.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  nuevaLinea(i?: Partial<FacturaItem>) {
    return this.fb.group({
      id: [i?.id ?? null],
      description: [i?.description ?? '', Validators.required],
      quantity: [i?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      unitPrice: [i?.unitPrice ?? 0, [Validators.required, Validators.min(0)]],
      tax: [i?.tax ?? 21, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  anadirLinea() {
    this.items.push(this.nuevaLinea());
  }

  quitarLinea(index: number) {
    this.items.removeAt(index);
  }

  totalLinea(l: { quantity: number; unitPrice: number; tax: number }) {
    return (l.quantity || 0) * (l.unitPrice || 0) * (1 + (l.tax || 0) / 100);
  }

  get subtotal() {
    return this.items
      .getRawValue()
      .reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0);
  }

  get taxTotal() {
    return this.items
      .getRawValue()
      .reduce((s, l) => s + ((l.quantity || 0) * (l.unitPrice || 0) * (l.tax || 0)) / 100, 0);
  }

  get total() {
    return this.subtotal + this.taxTotal;
  }

  editar() {
    this.editando.set(true);
    this.form.enable();
  }

  cancelar() {
    this.cargar();
  }

guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.guardando.set(true);
  this.error.set('');

  // Los totales los debe recalcular el backend
  const payload = { ...this.form.getRawValue(), id: this.id } as Partial<Factura> & { id: number };

  this.service.actualizarFactura(payload).subscribe({
    next: () => {
      this.guardando.set(false);
      this.cargar();
    },
    error: () => {
      this.guardando.set(false);
      this.error.set('No se pudo guardar la factura.');
      this.cdr.markForCheck();
    },
  });
}

  descargarPdf() {
    this.service.descargarPdf(this.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${this.form.get('invoiceNumber')?.value ?? this.id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.error.set('No se pudo descargar el PDF.');
        this.cdr.markForCheck();
      },
    });
  }
}