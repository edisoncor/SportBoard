import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

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
    imports: [MatIconModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
    @Input() sidebarOpened: boolean = false;
    @Output() menuClicked = new EventEmitter<void>();
    
    userName: string | null = null;
    userImage: string | null = null;
    userDropdownOpen: boolean = false;
    notificationDropdownOpen: boolean = false;
    notificationCount: number = 5;
    isScrolled: boolean = false;
    activePage: string = 'dashboard';
    isLoggedIn: boolean = false;
    isMobile: boolean = false;
    private destroy$ = new Subject<void>();
    
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
    
    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {}
    
    ngOnInit(): void {
        // Check if mobile
        this.checkIfMobile();
        
        // Subscribirse a los cambios en el estado de autenticación
        this.authService.currentUser
            .pipe(takeUntil(this.destroy$))
            .subscribe((user: User | null) => {
                this.isLoggedIn = !!user;
                if (user) {
                    this.userName = `${user.firstname} ${user.lastname}`;
                    this.userImage = user.image || null;
                } else {
                    this.userName = null;
                    this.userImage = null;
                }
            });
        
        // Track current route for active nav highlighting
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe((event: any) => {
            const url = event.urlAfterRedirects || event.url;
            this.activePage = url.split('/')[1] || 'dashboard';
        });
        
        this.updateNotificationCount();
    }
    
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 20;
    }
    
    @HostListener('window:resize', [])
    onResize() {
        this.checkIfMobile();
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
    
    logout(event: Event) {
        event.preventDefault();
        const name = this.userName || 'Usuario';
        this.authService.logout();
        this.snackBar.open(`¡Hasta pronto, ${name}! Has cerrado sesión correctamente.`, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
        });
    }
    
    checkIfMobile(): void {
        this.isMobile = window.innerWidth < 768;
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
