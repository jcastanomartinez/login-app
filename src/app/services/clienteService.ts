import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteDraft } from '../models/Cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);

  // AJUSTAR: misma apiUrl que uses en facturaService (api-gateway)
  private apiUrl = 'http://localhost:8080';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  crearCliente(cliente: ClienteDraft): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, cliente);
  }

  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/clientes/${cliente.id}`, cliente);
  }

  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
  }
}