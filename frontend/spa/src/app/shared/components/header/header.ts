import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatIconModule, CommonModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header implements OnInit {
    @Input() sidebarOpened: boolean = false;
    @Output() menuClicked = new EventEmitter<void>();
    
    userName: string | null = null;
    userDropdownOpen: boolean = false;
    notificationCount: number = 3;
    isScrolled: boolean = false;
    activePage: string = 'dashboard';
    
    ngOnInit(): void {
        // Aquí se podría cargar datos del usuario desde un servicio
        this.userName = 'Juan Pérez';
    }
    
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 20;
    }
    
    toggleUserDropdown() {
        this.userDropdownOpen = !this.userDropdownOpen;
    }
    
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        // Cerrar el dropdown si se hace clic fuera de él
        const userMenuElement = (event.target as HTMLElement).closest('.user-menu');
        if (!userMenuElement && this.userDropdownOpen) {
            this.userDropdownOpen = false;
        }
    }
}
