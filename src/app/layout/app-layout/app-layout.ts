import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../services/auth'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css'
})
export class AppLayout implements OnInit {
  nombreUsuario = signal('');

  constructor(private authService: Auth, private router: Router) {}

  menuAbierto = signal(true); // en desktop probablemente quieras que arranque abierto

  toggleMenu() {
    this.menuAbierto.update(v => !v);
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  ngOnInit(): void {
    this.authService.getUsuarioActual().subscribe({
      next: (data) => this.nombreUsuario.set(data.nombre),
      error: (err) => console.error(err)
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}