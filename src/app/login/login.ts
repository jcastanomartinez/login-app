import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../services/auth';
import { Notification } from '../services/notification';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  emailInvalidoEnSubmit = false;
  passwordInvalidoEnSubmit = false;
  errorLogin = null;


  constructor(private authService: Auth, private router:Router,private notificationService: Notification) { }

  onSubmit() {
    this.emailInvalidoEnSubmit = this.loginForm.controls.email.invalid;
    this.passwordInvalidoEnSubmit = this.loginForm.controls.password.invalid;


    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '')
        .subscribe({
          next: (tokens) => {
            console.log('pasa')
            this.router.navigate(['/home']);            
          },
          error: (err) => {
            this.notificationService.mostrarError('Credenciales inválidas.');
            //this.errorLogin=err.message;
            //console.log(err);           
          }
        });

      //console.log('El email es: ' + this.loginForm.value.email + '...');
    } else {
      console.log('Formulario inválido');
    }
  }
}