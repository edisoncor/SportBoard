import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loginError = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.loginError = false;

    // Simulando una petición al backend
    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      
      // Credenciales de prueba - en un entorno real esto sería una llamada a un servicio de autenticación
      if (email === 'demo@sportboard.com' && password === 'password') {
        // Login exitoso
        this.router.navigate(['/dashboard']);
      } else {
        // Login fallido
        this.loginError = true;
      }
      
      this.isLoading = false;
    }, 1500);
  }

  // Getters para acceder fácilmente a los campos del formulario
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
