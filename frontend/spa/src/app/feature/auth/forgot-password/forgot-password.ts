import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  submitted = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.submitted = true;

    const { email } = this.forgotPasswordForm.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.success = true;
        // No redirect, stay on the same page but show success message
      },
      error: (error) => {
        this.isLoading = false;
        this.success = false;
        this.errorMessage = error.message || 'Error al solicitar el restablecimiento de contraseña.';
        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Getter para acceder fácilmente a los campos del formulario
  get email() { return this.forgotPasswordForm.get('email'); }
}
