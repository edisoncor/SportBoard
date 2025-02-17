import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../models/user_manage/user.model'; 
import { UserService } from '../../services/user_manage/user.service';

@Component({
    selector: 'app-inicio-sesion',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule, 
        ReactiveFormsModule
    ],
    templateUrl: './inicio_sesion.component.html',
    styleUrls: ['./inicio_sesion.component.scss']
})
export class InicioSesionComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService) {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', Validators.required]
      });
     }
    onSubmit() {
      if (this.loginForm.valid) {
        const user: User = {
          username: this.loginForm.value.username,
          email: '',
          password: this.loginForm.value.password
        };
  
        this.userService.loginUser(user).subscribe({
          next: (response) => {
            console.log('Inicio de sesion correcto', response);
            this.router.navigate(['/usuarios/gestions-usuario']);
          },
          error: (error) => {
            console.error('Error al iniciar sesion', error);
          }
        });
      } else {
        console.log('Formulario no válido');
      }
    }
    navigateToRegistro(){
      this.router.navigate(['usuarios/registro']);
    }
  }
