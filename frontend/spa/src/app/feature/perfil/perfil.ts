import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [
        CommonModule, 
        MatIconModule,
        RouterModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatCardModule,
        MatSlideToggleModule,
        MatDividerModule
    ],
    templateUrl: './perfil.html',
    styleUrl: './perfil.scss'
})
export class PerfilComponent implements OnInit {
  usuario = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    nombreUsuario: 'juan.perez',
    email: 'juan.perez@example.com',
    telefono: '+34 123 456 789',
    fechaNacimiento: '1990-05-15',
    ubicacion: 'Madrid, España',
    rol: 'Administrador',
    biografia: 'Apasionado del deporte y la tecnología. Trabajo como administrador de plataformas deportivas y me encanta organizar torneos y eventos.',
    redesSociales: {
      twitter: '@juanperez',
      linkedin: 'linkedin.com/in/juanperez',
      instagram: '@juan.perez'
    },
    preferencias: {
      deportesFavoritos: ['Fútbol', 'Baloncesto', 'Tenis'],
      temasPreferidos: ['Torneos', 'Estadísticas', 'Equipos'],
      notificaciones: {
        email: true,
        push: true,
        sms: false
      },
      idioma: 'Español',
      temaOscuro: false
    },
    actividad: [
      {
        tipo: 'Edición',
        descripcion: 'Actualizó la información del torneo "Copa Universitaria"',
        fecha: '2025-06-30T14:25:00'
      },
      {
        tipo: 'Creación',
        descripcion: 'Creó un nuevo equipo "Los Halcones"',
        fecha: '2025-06-28T10:15:00'
      },
      {
        tipo: 'Participación',
        descripcion: 'Se unió al evento "Maratón Solidaria"',
        fecha: '2025-06-25T09:30:00'
      }
    ]
  };
  
  passwordForm = {
    passwordActual: '',
    nuevoPassword: '',
    confirmarPassword: ''
  };
  
  idiomas = ['Español', 'English', 'Français', 'Deutsch', 'Italiano', 'Português'];
  
  ngOnInit(): void {
  }
  
  actualizarPerfil(): void {
    console.log('Perfil actualizado');
    // Aquí iría la lógica para actualizar el perfil
  }
  
  cambiarPassword(): void {
    console.log('Contraseña cambiada');
    // Aquí iría la lógica para cambiar la contraseña
    this.passwordForm = {
      passwordActual: '',
      nuevoPassword: '',
      confirmarPassword: ''
    };
  }
  
  toggleNotificacion(tipo: string): void {
    if (tipo === 'email') {
      this.usuario.preferencias.notificaciones.email = !this.usuario.preferencias.notificaciones.email;
    } else if (tipo === 'push') {
      this.usuario.preferencias.notificaciones.push = !this.usuario.preferencias.notificaciones.push;
    } else if (tipo === 'sms') {
      this.usuario.preferencias.notificaciones.sms = !this.usuario.preferencias.notificaciones.sms;
    }
  }
  
  toggleTemaOscuro(): void {
    this.usuario.preferencias.temaOscuro = !this.usuario.preferencias.temaOscuro;
  }
}
