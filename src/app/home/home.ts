import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../services/auth';
import { FacturaService } from '../services/facturaService';
import { Factura } from '../models/Factura';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  facturas = signal<Factura[]>([]);
  menuAbierto = false; // o signal(false), como prefieras


  constructor(private authService: Auth, private router: Router, private facturaService: FacturaService) { }



  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  ngOnInit(): void {
    this.facturaService.getFacturas().subscribe({
      next: (facturas) => this.facturas.set(facturas),
      error: (err) => console.log('ERROR:', err)
    });
  }
  public cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
