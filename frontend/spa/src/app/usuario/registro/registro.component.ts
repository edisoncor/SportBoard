import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../models/user_manage/user.model'; 
import { UserService } from '../../services/user_manage/user.service';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule
    ],
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  registroForm: FormGroup;
  hide = true;  // Variable para controlar la visibilidad de la contraseña

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private userService: UserService ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const user: User = {
        username: this.registroForm.value.username,
        email: this.registroForm.value.email,
        password: this.registroForm.value.password
      };

      this.userService.createUser(user).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          this.router.navigate(['/usuarios/gestion-usuario']);
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }
  navigateToInicioSesion() {
    //this.router.navigate(['/usuarios/inicio-sesion']);
    this.router.navigate(['/usuarios/gestion-usuario']);
  }
}