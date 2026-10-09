import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/clienteService'; // AJUSTAR rutas
import { Cliente, ClienteDraft } from '../models/Cliente';

const EMPTY_CLIENTE: ClienteDraft = {
  name: '',
  taxId: '',
  address: '',
  email: '',
  phone: '',
};

@Component({
  selector: 'app-clientes-listado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes-listado.html',
  styleUrl: './clientes-listado.css',
})
export class ClientesListado implements OnInit {
  private service = inject(ClienteService);

  clientes = signal<Cliente[]>([]);
  loading = signal(true);
  errorMsg = signal('');
  search = signal('');

  // Lista filtrada y ordenada por nombre
  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const list = [...this.clientes()].sort((a, b) => a.name.localeCompare(b.name));
    if (!term) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.taxId.toLowerCase().includes(term) ||
        (c.email ?? '').toLowerCase().includes(term),
    );
  });

  // Modal crear / editar
  showModal = signal(false);
  editingId = signal<number | null>(null);
  form = signal<ClienteDraft>({ ...EMPTY_CLIENTE });
  formError = signal('');
  saving = signal(false);

  // Modal eliminar
  clienteToDelete = signal<Cliente | null>(null);
  deleting = signal(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.service.getClientes().subscribe({
      next: (lista: Cliente[]) => {
        this.clientes.set(lista);
        this.errorMsg.set('');
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg.set(this.messageFrom(err, 'No se pudieron cargar los clientes.'));
        this.loading.set(false);
      },
    });
  }

  // ---------- Crear / editar ----------

  openCreate() {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_CLIENTE });
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(c: Cliente) {
    this.editingId.set(c.id);
    this.form.set({
      name: c.name ?? '',
      taxId: c.taxId ?? '',
      address: c.address ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
    });
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() {
    if (this.saving()) return;
    this.showModal.set(false);
  }

  updateField(field: keyof ClienteDraft, value: string) {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  private validate(): string {
    const f = this.form();
    if (!f.name.trim()) return 'El nombre es obligatorio.';
    if (!f.taxId.trim()) return 'El CIF/NIF es obligatorio.';
    if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
      return 'El email no es válido.';
    }
    return '';
  }

  save() {
    const msg = this.validate();
    if (msg) {
      this.formError.set(msg);
      return;
    }

    const f = this.form();
    const draft: ClienteDraft = {
      name: f.name.trim(),
      taxId: f.taxId.trim().toUpperCase(),
      address: f.address.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
    };

    const id = this.editingId();
    this.saving.set(true);
    this.formError.set('');

    const request$ =
      id === null
        ? this.service.crearCliente(draft)
        : this.service.actualizarCliente({ ...draft, id });

    request$.subscribe({
      next: (saved: Cliente) => {
        this.clientes.update((list) =>
          id === null ? [...list, saved] : list.map((c) => (c.id === saved.id ? saved : c)),
        );
        this.saving.set(false);
        this.showModal.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.formError.set(this.messageFrom(err, 'No se pudo guardar el cliente.'));
      },
    });
  }

  // ---------- Eliminar ----------

  askDelete(c: Cliente) {
    this.clienteToDelete.set(c);
  }

  cancelDelete() {
    if (this.deleting()) return;
    this.clienteToDelete.set(null);
  }

  confirmDelete() {
    const target = this.clienteToDelete();
    if (!target) return;

    this.deleting.set(true);
    this.service.eliminarCliente(target.id).subscribe({
      next: () => {
        this.clientes.update((list) => list.filter((c) => c.id !== target.id));
        this.deleting.set(false);
        this.clienteToDelete.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting.set(false);
        this.clienteToDelete.set(null);
        this.errorMsg.set(this.messageFrom(err, 'No se pudo eliminar el cliente.'));
      },
    });
  }

  // ---------- Utilidades ----------

  private messageFrom(err: HttpErrorResponse, fallback: string): string {
    switch (err.status) {
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'El cliente ya no existe.';
      case 409:
        return 'Conflicto: el CIF/NIF ya existe o el cliente tiene facturas asociadas.';
      default:
        return fallback;
    }
  }
}