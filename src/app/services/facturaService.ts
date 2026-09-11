import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { Factura } from '../models/Factura';
import { environment } from '../../environments/environment.development';

export type FacturaDraft = Omit<Factura, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class FacturaService {

  constructor(private http: HttpClient, private authService: Auth) { }

  getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${environment.apiUrl}/facturas`, { headers: this.getHeaders() });
  }

  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${environment.apiUrl}/facturas/${id}`, { headers: this.getHeaders() });
  }

  crearFactura(factura: FacturaDraft): Observable<Factura> {
    return this.http.post<Factura>(`${environment.apiUrl}/facturas`, factura, { headers: this.getHeaders() });
  }

  actualizarFactura(factura: Factura): Observable<Factura> {
    return this.http.put<Factura>(`${environment.apiUrl}/facturas/${factura.id}`, factura, { headers: this.getHeaders() });
  }

  eliminarFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/facturas/${id}`, { headers: this.getHeaders() });
  }
}