import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FacturaService } from '../services/facturaService';
import { Factura } from '../models/Factura';

@Component({
  selector: 'app-facturas-listado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facturas-listado.html',
  styleUrl: './facturas-listado.css'
})
export class FacturasListado implements OnInit {
  facturas = signal<Factura[]>([]);

  constructor(private facturaService: FacturaService, private router: Router) {}

  ngOnInit(): void {
    this.facturaService.getFacturas().subscribe({
      next: (data) => this.facturas.set(data),
      error: (err) => console.error('Error al cargar facturas:', err)
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/facturas', id]);
  }
}