import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';
import { Observable } from 'rxjs';
import { Factura } from '../models/Factura';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {


 constructor(private http: HttpClient, private authService: Auth) {}

  getFacturas(): Observable<Factura[]> {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Factura[]>(`${environment.apiUrl}/facturas`, { headers });
  }
  
}
