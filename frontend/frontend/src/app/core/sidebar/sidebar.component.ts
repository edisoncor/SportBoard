import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterModule, SharedModule, MatMenuModule, MatExpansionModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})

export class SidebarComponent {
    @Output() showMenu = new EventEmitter<void>();

    isCalendarMenuOpen = false; // controla la visibilidad del menú
    isSidebarOpen = true;

    constructor(private router: Router) {}

    toggleCalendarMenu() {
        this.isCalendarMenuOpen = !this.isCalendarMenuOpen; // Alterna entre mostrado y no mostrado cuando se lo llame
    }

    toggleSidebar(sidenav: any) {
        sidenav.toggle();
    }

    navigateToGestionUsuario() {
        this.router.navigate(['/usuarios/gestion-usuario']);
    }
}