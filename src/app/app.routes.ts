import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authGuard } from './guards/auth-guard';
import { RegisterComponent } from './register/register';
import { FacturasListado } from './facturas-listado/facturas-listado';
import { FacturaDetalle } from './factura-detalle/factura-detalle';
import { AppLayout } from './layout/app-layout/app-layout';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'facturas', component: FacturasListado },
      { path: 'facturas/:id', component: FacturaDetalle },
    ]
  }
];