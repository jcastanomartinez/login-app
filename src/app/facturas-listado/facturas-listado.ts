import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService, FacturaDraft } from '../services/facturaService';
import { Factura } from '../models/Factura';

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

  // --- Edición de fila completa ---
  editingId = signal<number | null>(null);
  editBuffer = signal<Factura | null>(null);
  savingEdit = signal(false);

  // --- Modal de creación ---
  showAddModal = signal(false);
  newFactura = signal<FacturaDraft>(this.emptyDraft());
  savingNew = signal(false);

  // --- Modal de eliminación ---
  facturaToDelete = signal<Factura | null>(null);
  deleting = signal(false);

  // --- Mensaje de error genérico para mostrar en la UI ---
  errorMsg = signal<string | null>(null);

  constructor(private facturaService: FacturaService) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  private cargarFacturas(): void {
    this.facturaService.getFacturas().subscribe({
      next: (data) => this.facturas.set(data),
      error: (err) => console.error('Error al cargar facturas:', err)
    });
  }

  private emptyDraft(): FacturaDraft {
    return { num_factura: '', cliente: '', fecha_factura: '', importe: 0, estado: 'Pendiente' };
  }

  // ================== AÑADIR ==================
  openAddModal(): void {
    this.newFactura.set(this.emptyDraft());
    this.errorMsg.set(null);
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  confirmAdd(): void {
    const draft = this.newFactura();
    if (!draft.num_factura.trim() || !draft.cliente.trim()) {
      this.errorMsg.set('Nº de factura y cliente son obligatorios.');
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
        this.errorMsg.set('No se ha podido crear la factura.');
        this.savingNew.set(false);
      }
    });
  }

  // ================== EDITAR (fila completa) ==================
  startEdit(factura: Factura): void {
    this.editingId.set(factura.id);
    this.editBuffer.set({ ...factura });
    this.errorMsg.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editBuffer.set(null);
  }

  saveEdit(): void {
    const buffer = this.editBuffer();
    if (!buffer) return;

    this.savingEdit.set(true);
    this.facturaService.actualizarFactura(buffer).subscribe({
      next: (actualizada) => {
        this.facturas.update(list =>
          list.map(f => (f.id === actualizada.id ? actualizada : f))
        );
        this.savingEdit.set(false);
        this.editingId.set(null);
        this.editBuffer.set(null);
      },
      error: (err) => {
        console.error('Error al actualizar factura:', err);
        this.errorMsg.set('No se ha podido guardar el cambio.');
        this.savingEdit.set(false);
        // el buffer se mantiene visible para que el usuario pueda reintentar
      }
    });
  }

  updateBufferField<K extends keyof Factura>(field: K, value: Factura[K]): void {
    const buffer = this.editBuffer();
    if (!buffer) return;
    this.editBuffer.set({ ...buffer, [field]: value });
  }

  // Convierte cualquier fecha almacenada (ISO completo o yyyy-MM-dd) al formato
  // que exige <input type="date">. No usa new Date() para evitar desfases de zona horaria.
  dateForInput(fecha: string | null | undefined): string {
    if (!fecha) return '';
    return fecha.substring(0, 10);
  }

  // ================== ELIMINAR ==================
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
        this.errorMsg.set('No se ha podido eliminar la factura.');
        this.deleting.set(false);
      }
    });
  }

  // ================== UTILIDADES ==================
  badgeClass(estado: string): Record<string, boolean> {
    return {
      badge: true,
      paid: estado === 'Pagada',
      pending: estado === 'Pendiente',
      overdue: estado === 'Vencida'
    };
  }
}