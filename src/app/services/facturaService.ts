import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura, FacturaDraft } from '../models/Factura'; // AJUSTAR

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private http = inject(HttpClient);

  // AJUSTAR: tu URL del api-gateway (o environment.apiUrl)
  private apiUrl = 'http://localhost:8080';

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.apiUrl}/facturas`);
  }

  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/facturas/${id}`);
  }

  crearFactura(factura: FacturaDraft): Observable<Factura> {
    return this.http.post<Factura>(`${this.apiUrl}/facturas`, factura);
  }

  actualizarFactura(factura: Partial<Factura> & { id: number }): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/facturas/${factura.id}`, factura);
  }

  eliminarFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/facturas/${id}`);
  }

  // AJUSTAR: el endpoint real que genera el PDF
  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/facturas/${id}/pdf`, { responseType: 'blob' });
  }
}