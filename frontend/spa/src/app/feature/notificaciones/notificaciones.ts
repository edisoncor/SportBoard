import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Notificacion {
    id: number;
    title: string;
    message: string;
    time: string;
    date: string;
    read: boolean;
    icon: string;
    type: 'default' | 'alert' | 'error' | 'success';
    action?: string;
}

@Component({
    selector: 'app-notificaciones',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCheckboxModule],
    templateUrl: './notificaciones.html',
    styleUrl: './notificaciones.scss'
})
export class NotificacionesComponent {
    notificaciones: Notificacion[] = [
        {
            id: 1,
            title: 'Nuevo torneo disponible',
            message: 'Se ha creado un nuevo torneo de fútbol en tu región. ¡Inscribe a tu equipo ahora!',
            time: '10:30 AM',
            date: '01/07/2025',
            read: false,
            icon: 'emoji_events',
            type: 'default',
            action: 'Ver torneo'
        },
        {
            id: 2,
            title: 'Partido finalizado',
            message: 'El partido entre Equipo A y Equipo B ha finalizado con resultado 3-1. Ya puedes consultar las estadísticas.',
            time: '5:45 PM',
            date: '30/06/2025',
            read: false,
            icon: 'sports_soccer',
            type: 'success',
            action: 'Ver resultados'
        },
        {
            id: 3,
            title: 'Problema con la inscripción',
            message: 'Hubo un problema con tu inscripción al torneo de baloncesto. Por favor, revisa los datos proporcionados.',
            time: '2:20 PM',
            date: '30/06/2025',
            read: false,
            icon: 'warning',
            type: 'error',
            action: 'Revisar inscripción'
        },
        {
            id: 4,
            title: 'Recordatorio de partido',
            message: 'Tu equipo tiene un partido programado para mañana a las 17:00 en el Estadio Municipal. No olvides asistir.',
            time: '1:15 PM',
            date: '30/06/2025',
            read: false,
            icon: 'event',
            type: 'alert',
            action: 'Ver detalles'
        },
        {
            id: 5,
            title: 'Actualización de estadísticas',
            message: 'Se han actualizado las estadísticas de tu equipo para la temporada actual. Consulta tu posición en la clasificación.',
            time: '11:30 AM',
            date: '29/06/2025',
            read: true,
            icon: 'leaderboard',
            type: 'default',
            action: 'Ver estadísticas'
        },
        {
            id: 6,
            title: 'Invitación a torneo',
            message: 'Has recibido una invitación para participar en el Torneo Regional de Voleibol que se celebrará el próximo mes.',
            time: '9:45 AM',
            date: '29/06/2025',
            read: true,
            icon: 'mail',
            type: 'default',
            action: 'Responder'
        },
        {
            id: 7,
            title: 'Cambio de horario',
            message: 'El partido programado para el 05/07/2025 ha sido reprogramado para las 18:30 debido a condiciones meteorológicas.',
            time: '4:10 PM',
            date: '28/06/2025',
            read: true,
            icon: 'schedule',
            type: 'alert',
            action: 'Confirmar'
        },
        {
            id: 8,
            title: 'Nuevo jugador registrado',
            message: 'Carlos Rodríguez ha solicitado unirse a tu equipo. Revisa su perfil y aprueba su solicitud.',
            time: '1:30 PM',
            date: '28/06/2025',
            read: true,
            icon: 'person_add',
            type: 'default',
            action: 'Ver perfil'
        },
        {
            id: 9,
            title: 'Pago recibido',
            message: 'Hemos recibido el pago de la inscripción al torneo de tenis. Tu participación ha sido confirmada.',
            time: '11:20 AM',
            date: '27/06/2025',
            read: true,
            icon: 'payment',
            type: 'success',
            action: 'Ver recibo'
        },
        {
            id: 10,
            title: 'Encuesta de satisfacción',
            message: 'Nos gustaría conocer tu opinión sobre el último torneo en el que participaste. Por favor, completa la encuesta.',
            time: '10:00 AM',
            date: '27/06/2025',
            read: true,
            icon: 'rate_review',
            type: 'default',
            action: 'Completar encuesta'
        }
    ];

    filtroActual = 'todas';
    seleccionarTodas = false;
    notificacionesSeleccionadas: number[] = [];

    // Getters para contar notificaciones por estado
    get totalNotificaciones(): number {
        return this.notificaciones.length;
    }

    get notificacionesNoLeidas(): number {
        return this.notificaciones.filter(n => !n.read).length;
    }

    get notificacionesLeidas(): number {
        return this.notificaciones.filter(n => n.read).length;
    }

    get hayNotificacionesNoLeidas(): boolean {
        return this.notificacionesNoLeidas > 0;
    }

    get hayNotificacionesLeidas(): boolean {
        return this.notificacionesLeidas > 0;
    }

    get hayNotificaciones(): boolean {
        return this.totalNotificaciones > 0;
    }

    get notificacionesFiltradas(): Notificacion[] {
        return this.obtenerNotificacionesFiltradas();
    }

    filtrarNotificaciones(filtro: string) {
        this.filtroActual = filtro;
    }

    obtenerNotificacionesFiltradas() {
        if (this.filtroActual === 'todas') {
            return this.notificaciones;
        } else if (this.filtroActual === 'noLeidas') {
            return this.notificaciones.filter(n => !n.read);
        } else if (this.filtroActual === 'leidas') {
            return this.notificaciones.filter(n => n.read);
        }
        return this.notificaciones;
    }

    marcarComoLeida(id: number) {
        const notificacion = this.notificaciones.find(n => n.id === id);
        if (notificacion) {
            notificacion.read = true;
        }
    }

    toggleSeleccion(id: number) {
        const index = this.notificacionesSeleccionadas.indexOf(id);
        if (index === -1) {
            this.notificacionesSeleccionadas.push(id);
        } else {
            this.notificacionesSeleccionadas.splice(index, 1);
        }
        this.seleccionarTodas = this.notificacionesSeleccionadas.length === this.notificaciones.length;
    }

    toggleSeleccionarTodas() {
        this.seleccionarTodas = !this.seleccionarTodas;
        if (this.seleccionarTodas) {
            this.notificacionesSeleccionadas = this.notificaciones.map(n => n.id);
        } else {
            this.notificacionesSeleccionadas = [];
        }
    }

    eliminarSeleccionadas() {
        this.notificaciones = this.notificaciones.filter(n => !this.notificacionesSeleccionadas.includes(n.id));
        this.notificacionesSeleccionadas = [];
        this.seleccionarTodas = false;
    }

    marcarSeleccionadasComoLeidas() {
        this.notificaciones.forEach(n => {
            if (this.notificacionesSeleccionadas.includes(n.id)) {
                n.read = true;
            }
        });
    }
}
