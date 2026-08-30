import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  mensaje = signal<string | null>(null);

  mostrarError(texto: string): void {
    this.mensaje.set(texto);
    setTimeout(() => this.mensaje.set(null), 3000);
  }
}