import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../services/facturaService';
import { Factura, FacturaDraft, FacturaItem } from '../models/Factura';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facturas-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturas-listado.html',
  styleUrl: './facturas-listado.css'
})
export class FacturasListado implements OnInit {
  facturas = signal<Factura[]>([]);
  estados: string[] = ['Pagada', 'Pendiente', 'Vencida'];

  editingId = signal<number | null>(null);
  editBuffer = signal<Factura | null>(null);
  savingEdit = signal(false);

  showAddModal = signal(false);
  newFactura = signal<FacturaDraft>(this.emptyDraft());
  savingNew = signal(false);

  facturaToDelete = signal<Factura | null>(null);
  deleting = signal(false);
  downloadingPdfId = signal<number | null>(null);
  errorMsg = signal<string | null>(null);

  constructor(private facturaService: FacturaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  irADetalle(id: number) {
    this.router.navigate(['/facturas', id]);
  }

  private cargarFacturas(): void {
    this.facturaService.getFacturas().subscribe({
      next: (data) => this.facturas.set(data),
      error: (err) => {
        console.error('Error al cargar facturas:', err);
        this.errorMsg.set('No se han podido cargar las facturas.');
      }
    });
  }

  private emptyDraft(): FacturaDraft {
    return {
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().substring(0, 10),
      companyName: '',
      companyTaxId: '',
      companyAddress: '',
      companyEmail: '',
      customerName: '',
      customerTaxId: '',
      customerAddress: '',
      estado: 'Pendiente',
      items: [{ description: '', quantity: 1, unitPrice: 0, tax: 21 }]
    };
  }

  openAddModal(): void {
    this.newFactura.set(this.emptyDraft());
    this.errorMsg.set(null);
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    if (!this.savingNew()) this.showAddModal.set(false);
  }

  updateNewField<K extends keyof FacturaDraft>(field: K, value: FacturaDraft[K]): void {
    this.newFactura.set({ ...this.newFactura(), [field]: value });
  }

  addItem(): void {
    const factura = this.newFactura();
    this.newFactura.set({
      ...factura,
      items: [...factura.items, { description: '', quantity: 1, unitPrice: 0, tax: 21 }]
    });
  }

  removeItem(index: number): void {
    const factura = this.newFactura();
    if (factura.items.length <= 1) return;
    this.newFactura.set({ ...factura, items: factura.items.filter((_, i) => i !== index) });
  }

  updateNewItem(index: number, field: keyof FacturaItem, value: string | number): void {
    const factura = this.newFactura();
    const items = factura.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    this.newFactura.set({ ...factura, items });
  }

  confirmAdd(): void {
    const draft = this.newFactura();
    if (!draft.invoiceNumber.trim() || !draft.customerName.trim()) {
      this.errorMsg.set('Nº de factura y cliente son obligatorios.');
      return;
    }
    if (!draft.invoiceDate) {
      this.errorMsg.set('La fecha de factura es obligatoria.');
      return;
    }
    if (draft.items.some(item => !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0)) {
      this.errorMsg.set('Revisa las líneas: descripción, cantidad y precio son obligatorios.');
      return;
    }

    this.savingNew.set(true);
    this.facturaService.crearFactura(draft).subscribe({
      next: (creada) => {
        this.facturas.update(list => [...list, creada]);
        this.savingNew.set(false);
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Error al crear factura:', err);
        this.errorMsg.set(err?.error?.error || 'No se ha podido crear la factura.');
        this.savingNew.set(false);
      }
    });
  }

  
  updateBufferField<K extends keyof Factura>(field: K, value: Factura[K]): void {
    const buffer = this.editBuffer();
    if (!buffer) return;
    this.editBuffer.set({ ...buffer, [field]: value });
  }

  dateForInput(fecha: string | null | undefined): string {
    if (!fecha) return '';
    return fecha.substring(0, 10);
  }

  askDelete(factura: Factura): void {
    this.facturaToDelete.set(factura);
    this.errorMsg.set(null);
  }

  cancelDelete(): void {
    this.facturaToDelete.set(null);
  }

  confirmDelete(): void {
    const target = this.facturaToDelete();
    if (!target) return;

    this.deleting.set(true);
    this.facturaService.eliminarFactura(target.id).subscribe({
      next: () => {
        this.facturas.update(list => list.filter(f => f.id !== target.id));
        this.deleting.set(false);
        this.facturaToDelete.set(null);
      },
      error: (err) => {
        console.error('Error al eliminar factura:', err);
        this.errorMsg.set(err?.error?.error || 'No se ha podido eliminar la factura.');
        this.deleting.set(false);
      }
    });
  }

  descargarPdf(factura: Factura): void {
    this.downloadingPdfId.set(factura.id);
    this.facturaService.descargarPdf(factura.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${factura.invoiceNumber || 'factura'}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
        this.downloadingPdfId.set(null);
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        this.errorMsg.set('No se ha podido descargar el PDF.');
        this.downloadingPdfId.set(null);
      }
    });
  }

  badgeClass(estado: string): Record<string, boolean> {
    return {
      badge: true,
      paid: estado === 'Pagada',
      pending: estado === 'Pendiente',
      overdue: estado === 'Vencida'
    };
  }
}
