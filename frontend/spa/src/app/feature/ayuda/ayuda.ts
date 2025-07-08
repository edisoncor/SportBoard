import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './ayuda.html',
  styleUrls: ['./ayuda.scss']
})
export class AyudaComponent {
  faqs = [
    {
      question: '¿Cómo puedo crear un nuevo torneo?',
      answer: 'Para crear un nuevo torneo, navega a la sección de Torneos y haz clic en el botón "Crear Torneo". Sigue las instrucciones del asistente para configurar las fechas, equipos participantes y formato del torneo.'
    },
    {
      question: '¿Cómo puedo añadir un equipo a un torneo existente?',
      answer: 'Dirígete a la sección de Torneos, selecciona el torneo deseado y haz clic en "Gestionar equipos". Allí podrás añadir nuevos equipos al torneo siempre que estén dentro del período de inscripción.'
    },
    {
      question: '¿Cómo se calculan las estadísticas de rendimiento?',
      answer: 'Las estadísticas de rendimiento se calculan basándose en los datos históricos de partidos jugados, goles anotados, posesión de balón y otros factores relevantes según el deporte. Estos datos se actualizan automáticamente después de cada partido.'
    },
    {
      question: '¿Puedo exportar las estadísticas de mi equipo?',
      answer: 'Sí, puedes exportar las estadísticas en varios formatos (PDF, Excel, CSV) desde la sección de Estadísticas. Selecciona el equipo y el período de tiempo, y utiliza el botón "Exportar" ubicado en la parte superior derecha.'
    },
    {
      question: '¿Cómo actualizo la información de mi perfil?',
      answer: 'Para actualizar tu información de perfil, navega a la sección de Perfil y haz clic en "Editar perfil". Allí podrás modificar tu foto, información personal y preferencias de notificaciones.'
    }
  ];

  tutorials = [
    {
      title: 'Primeros pasos con SportBoard',
      description: 'Aprende los conceptos básicos para comenzar a utilizar la plataforma',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'assets/images/tutorials/tutorial-1.jpg'
    },
    {
      title: 'Gestión de torneos y competiciones',
      description: 'Aprende a crear y administrar torneos de manera eficiente',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'assets/images/tutorials/tutorial-2.jpg'
    },
    {
      title: 'Análisis avanzado de estadísticas',
      description: 'Maximiza el uso de las herramientas de análisis estadístico',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'assets/images/tutorials/tutorial-3.jpg'
    }
  ];

  contactInfo = {
    email: 'soporte@sportboard.com',
    phone: '+34 912 345 678',
    whatsapp: '+34 612 345 678',
    hours: 'Lunes a Viernes: 9:00 - 18:00'
  };
}
