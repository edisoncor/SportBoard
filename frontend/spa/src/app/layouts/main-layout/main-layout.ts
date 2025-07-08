import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { BottomNavigation } from '../../shared/components/bottom-navigation/bottom-navigation';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Sidebar, Footer, BottomNavigation],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayout {
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
