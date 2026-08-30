import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { authGuard } from './guards/auth-guard';
import { RegisterComponent } from './register/register';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path:'login',component: Login},
    {path: 'home', component: Home, canActivate: [authGuard]},
    { path: 'register', component: RegisterComponent }
];
