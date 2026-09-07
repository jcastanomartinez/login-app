import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { Factura } from '../models/Factura';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {


  constructor(private http: HttpClient, private authService: Auth) { }

getHeaders(): HttpHeaders{
  const token = this.authService.getAccessToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return headers;
}

  getFacturas(): Observable<Factura[]> {
    
  

    return this.http.get<Factura[]>(`${environment.apiUrl}/facturas`, { headers : this.getHeaders() });
  }

  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${environment.apiUrl}/facturas/${id}`, { headers: this.getHeaders() });
  }

}
