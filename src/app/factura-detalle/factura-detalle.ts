import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from '../services/facturaService';
import { Factura } from '../models/Factura';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura-detalle.html',
  styleUrl: './factura-detalle.css'
})
export class FacturaDetalle implements OnInit {
  factura = signal<Factura | null>(null);
  cargando = signal(true);
  error = signal(false);
  descargando = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.facturaService.getFacturaById(id).subscribe({
      next: (data) => { this.factura.set(data); this.cargando.set(false); },
      error: (err) => { console.error('Error al cargar factura:', err); this.error.set(true); this.cargando.set(false); }
    });
  }

  descargarPdf(): void {
    const factura = this.factura();
    if (!factura) return;
    this.descargando.set(true);
    this.facturaService.descargarPdf(factura.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${factura.invoiceNumber || 'factura'}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
        this.descargando.set(false);
      },
      error: (err) => { console.error('Error al descargar PDF:', err); this.descargando.set(false); }
    });
  }

  volver(): void { this.router.navigate(['/facturas']); }
}
