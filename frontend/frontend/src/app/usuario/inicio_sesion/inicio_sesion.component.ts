import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './inicio_sesion.component.html',
  styleUrls: ['./inicio_sesion.component.scss'],

})
export class InicioSesionComponent {
  hide = true;

  constructor(private router: Router) { }

    navigateToRegistro(){
      this.router.navigate(['usuarios/registro']);
    }
  }
