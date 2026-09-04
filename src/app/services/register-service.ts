import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  email: string;
  password: string;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  pais?: string;
  ciudad?: string;
  direccion?: string;
}

interface RegisterResponse {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class Register {
  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/user/register`, request);
  }
}