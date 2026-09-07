import { Injectable } from '@angular/core';
import { tap, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Usuario} from '../models/Usuario'




interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}


@Injectable({
  providedIn: 'root',
})




export class Auth {
constructor(private http: HttpClient) {}



  private guardarTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  estaAutenticado(): boolean {
    return this.getAccessToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }




getUsuarioActual(): Observable<Usuario> {
  const token = this.getAccessToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Usuario>(`${environment.apiUrl}/user/me`, { headers });
}


 login(email: string, password: string): Observable<AuthTokens> {
  return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/login`, { email, password })
    .pipe(
      tap(tokens => this.guardarTokens(tokens))
    );
}

}
