import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    type: 'default' | 'alert' | 'error' | 'success';
}

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatIconModule, CommonModule, RouterModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header implements OnInit {
    @Input() sidebarOpened: boolean = false;
    @Output() menuClicked = new EventEmitter<void>();
    
    userName: string | null = null;
    userDropdownOpen: boolean = false;
    notificationDropdownOpen: boolean = false;
    notificationCount: number = 5;
    isScrolled: boolean = false;
    activePage: string = 'dashboard';
    
    notifications: Notification[] = [
        {
            id: 1,
            title: 'Nuevo torneo disponible',
            message: 'Se ha creado un nuevo torneo de fútbol en tu región.',
            time: 'Hace 5 minutos',
            read: false,
            icon: 'emoji_events',
            type: 'default'
        },
        {
            id: 2,
            title: 'Partido finalizado',
            message: 'El partido entre Equipo A y Equipo B ha finalizado.',
            time: 'Hace 1 hora',
            read: false,
            icon: 'sports_soccer',
            type: 'success'
        },
        {
            id: 3,
            title: 'Problema con la inscripción',
            message: 'Hubo un problema con tu inscripción al torneo de baloncesto.',
            time: 'Hace 2 horas',
            read: false,
            icon: 'warning',
            type: 'error'
        },
        {
            id: 4,
            title: 'Recordatorio de partido',
            message: 'Tu equipo tiene un partido programado para mañana a las 17:00.',
            time: 'Hace 3 horas',
            read: false,
            icon: 'event',
            type: 'alert'
        },
        {
            id: 5,
            title: 'Actualización de estadísticas',
            message: 'Se han actualizado las estadísticas de tu equipo para la temporada actual.',
            time: 'Hace 1 día',
            read: true,
            icon: 'leaderboard',
            type: 'default'
        }
    ];
    
    ngOnInit(): void {
        // Aquí se podría cargar datos del usuario desde un servicio
        this.userName = 'Juan Pérez';
        this.updateNotificationCount();
    }
    
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 20;
    }
    
    toggleUserDropdown() {
        this.userDropdownOpen = !this.userDropdownOpen;
        if (this.userDropdownOpen) {
            this.notificationDropdownOpen = false;
        }
    }
    
    toggleNotificationDropdown(event: Event) {
        event.stopPropagation();
        this.notificationDropdownOpen = !this.notificationDropdownOpen;
        if (this.notificationDropdownOpen) {
            this.userDropdownOpen = false;
        }
    }
    
    markAllAsRead(event: Event) {
        event.stopPropagation();
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationCount();
    }
    
    updateNotificationCount() {
        this.notificationCount = this.notifications.filter(notification => !notification.read).length;
    }
    
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        // Cerrar los dropdowns si se hace clic fuera de ellos
        const userMenuElement = (event.target as HTMLElement).closest('.user-menu');
        const notificationElement = (event.target as HTMLElement).closest('.notification-icon');
        
        if (!userMenuElement && this.userDropdownOpen) {
            this.userDropdownOpen = false;
        }
        
        if (!notificationElement && this.notificationDropdownOpen) {
            this.notificationDropdownOpen = false;
        }
    }
}
