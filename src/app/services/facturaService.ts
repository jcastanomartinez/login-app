import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { Factura, FacturaDraft, FacturaItem } from '../models/Factura';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {

  constructor(private http: HttpClient, private authService: Auth) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${environment.apiUrl}/facturas`, {
      headers: this.getHeaders()
    });
  }

  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${environment.apiUrl}/facturas/${id}`, {
      headers: this.getHeaders()
    });
  }

  crearFactura(factura: FacturaDraft): Observable<Factura> {
    // Los totales son responsabilidad del backend.
    const request = {
      invoiceNumber: factura.invoiceNumber,
      invoiceDate: factura.invoiceDate,
      companyName: factura.companyName,
      companyTaxId: factura.companyTaxId,
      companyAddress: factura.companyAddress,
      companyEmail: factura.companyEmail,
      customerName: factura.customerName,
      customerTaxId: factura.customerTaxId,
      customerAddress: factura.customerAddress,
      estado: factura.estado,
      items: factura.items.map(item => this.toItemRequest(item))
    };

    return this.http.post<Factura>(`${environment.apiUrl}/facturas`, request, {
      headers: this.getHeaders()
    });
  }

  actualizarFactura(factura: Factura): Observable<Factura> {
    // El endpoint PUT recibe ActualizarFacturaRequest: no enviamos id ni invoiceNumber.
    const request = {
      invoiceDate: factura.invoiceDate,
      companyName: factura.companyName,
      companyTaxId: factura.companyTaxId,
      companyAddress: factura.companyAddress,
      companyEmail: factura.companyEmail,
      customerName: factura.customerName,
      customerTaxId: factura.customerTaxId,
      customerAddress: factura.customerAddress,
      estado: factura.estado,
      items: factura.items.map(item => this.toItemRequest(item))
    };

    return this.http.put<Factura>(`${environment.apiUrl}/facturas/${factura.id}`, request, {
      headers: this.getHeaders()
    });
  }

  eliminarFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/facturas/${id}`, {
      headers: this.getHeaders()
    });
  }

  descargarPdf(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/facturas/${id}/pdf`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  private toItemRequest(item: FacturaItem) {
    return {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      tax: item.tax
    };
  }
}
