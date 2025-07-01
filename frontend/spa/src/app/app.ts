import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, Footer, Header, Sidebar, CommonModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected title = 'SportBoard';
    public sidebarOpened = true;
    
    constructor() {
        // En dispositivos móviles, iniciamos con el sidebar cerrado
        this.checkScreenSize();
    }
    
    @HostListener('window:resize')
    onResize() {
        this.checkScreenSize();
    }
    
    private checkScreenSize() {
        if (window.innerWidth < 768) {
            this.sidebarOpened = false;
        }
    }

    toggleSidebar() {
        this.sidebarOpened = !this.sidebarOpened;
    }
}
