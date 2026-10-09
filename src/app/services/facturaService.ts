import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura, FacturaDraft } from '../models/Factura'; // AJUSTAR
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private http = inject(HttpClient);


  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${environment.apiUrl}/facturas`);
  }

  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${environment.apiUrl}/facturas/${id}`);
  }

  crearFactura(factura: FacturaDraft): Observable<Factura> {
    return this.http.post<Factura>(`${environment.apiUrl}/facturas`, factura);
  }

  actualizarFactura(factura: Partial<Factura> & { id: number }): Observable<Factura> {
    return this.http.put<Factura>(`${environment.apiUrl}/facturas/${factura.id}`, factura);
  }

  eliminarFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/facturas/${id}`);
  }

  // AJUSTAR: el endpoint real que genera el PDF
  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/facturas/${id}/pdf`, { responseType: 'blob' });
  }
}