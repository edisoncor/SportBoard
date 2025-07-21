import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-ajustes',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatButtonModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './ajustes.html',
    styleUrl: './ajustes.scss'
})
export class AjustesComponent {
    configuracion = {
        notificaciones: {
            torneos: true,
            equipos: true,
            partidos: true,
            resultados: true,
            sistema: false,
            email: true,
            push: true,
            sms: false
        },
        privacidad: {
            perfilPublico: true,
            mostrarEstadisticas: true,
            mostrarEquipos: true,
            permitirMensajes: true
        },
        apariencia: {
            tema: 'claro',
            colorPrimario: '#1e88e5',
            densidad: 'normal',
            animaciones: true
        },
        sistema: {
            mantenimiento: false,
            logsDetallados: false
        },
        idioma: 'es',
        zonaHoraria: 'America/Mexico_City'
    };

    temas = [
        { valor: 'claro', nombre: 'Claro' },
        { valor: 'oscuro', nombre: 'Oscuro' },
        { valor: 'sistema', nombre: 'Según sistema' }
    ];

    idiomas = [
        { valor: 'es', nombre: 'Español' },
        { valor: 'en', nombre: 'English' },
        { valor: 'fr', nombre: 'Français' },
        { valor: 'pt', nombre: 'Português' }
    ];

    zonasHorarias = [
        { valor: 'America/Mexico_City', nombre: 'Ciudad de México (UTC-6)' },
        { valor: 'America/New_York', nombre: 'Nueva York (UTC-5)' },
        { valor: 'Europe/Madrid', nombre: 'Madrid (UTC+1)' },
        { valor: 'Europe/London', nombre: 'Londres (UTC+0)' },
        { valor: 'Asia/Tokyo', nombre: 'Tokio (UTC+9)' }
    ];

    guardarCambios() {
        // Aquí iría la lógica para guardar los cambios
        console.log('Configuración guardada:', this.configuracion);
        // Mostrar mensaje de éxito
    }
}
