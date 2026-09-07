import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importante para ngModel
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from '../services/facturaService';
import { Factura } from '../models/Factura';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Añadido FormsModule
  templateUrl: './factura-detalle.html',
  styleUrl: './factura-detalle.css'
})
export class FacturaDetalle implements OnInit {
  factura = signal<Factura | null>(null);
  cargando = signal(true);
  error = signal(false);

  // Controla qué campo de la factura se está editando
  campoEditando = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.facturaService.getFacturaById(id).subscribe({
      next: (data) => {
        this.factura.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar factura:', err);
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  // Activa el modo edición para la celda dada
  activarEdicion(campo: string): void {
    this.campoEditando.set(campo);
  }

  // Cierra el modo edición (y aquí podrías guardar en backend si lo deseas)
  guardarEdicion(): void {
    this.campoEditando.set(null);
    // Ejemplo opcional para persistir cambios:
    // const f = this.factura();
    // if (f) this.facturaService.updateFactura(f).subscribe();
  }

  volver() {
    this.router.navigate(['/facturas']);
  }
}