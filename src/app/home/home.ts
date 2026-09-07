import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FacturaService } from '../services/facturaService'
import { Factura } from '../models/Factura';
import { DecimalPipe,DatePipe} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe,DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  facturas = signal<Factura[]>([]);

  facturasPendientes = computed(() =>
    this.facturas().filter(f => f.estado === 'Pendiente').length
  );

  ingresosDelMes = computed(() => {
    const ahora = new Date();
    return this.facturas()
      .filter(f => {
        const fecha = new Date(f.fecha_factura);
        return f.estado === 'Pagada'
          && fecha.getMonth() === ahora.getMonth()
          && fecha.getFullYear() === ahora.getFullYear();
      })
      .reduce((total, f) => total + f.importe, 0);
  });

  clientesActivos = computed(() =>
    new Set(this.facturas().map(f => f.cliente)).size
  );

  constructor(private router: Router, private facturaService: FacturaService) { }

  ngOnInit(): void {
    this.facturaService.getFacturas().subscribe({
      next: (facturas) => this.facturas.set(facturas),
      error: (err) => console.log('ERROR:', err)
    });
  }

  irADetalle(id: number) {
    this.router.navigate(['/facturas', id]);
  }
}