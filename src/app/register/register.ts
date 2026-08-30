import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Register, RegisterRequest } from '../services/register-service';
import { Notification } from '../services/notification';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
    telefono: new FormControl(''),
    pais: new FormControl(''),
    ciudad: new FormControl(''),
    direccion: new FormControl(''),
  });

  emailInvalidoEnSubmit = false;
  passwordInvalidoEnSubmit = false;

  constructor(
    private registerService: Register,
    private router: Router,
    private notificationService: Notification
  ) {}

  onSubmit() {
    this.emailInvalidoEnSubmit = this.registerForm.controls.email.invalid;
    this.passwordInvalidoEnSubmit = this.registerForm.controls.password.invalid;

    if (this.registerForm.valid) {
      const request = this.registerForm.value as RegisterRequest;
      this.registerService.register(request).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.notificationService.mostrarError(err.error?.error ?? 'Error al registrar');
        }
      });
    }
  }
}