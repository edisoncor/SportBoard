import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { SharedModule } from './shared/shared.module';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterModule,
        RouterOutlet,
        SharedModule,
        SidebarComponent
    ]
})
export class AppComponent {
    title = 'SportBoard';
    isSidebarOpen = true;
    isMobile = false;

    // BreakpointObserver es usado para detectar cambios en el tamaño de la pantalla
    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
            this.isMobile = result.matches
        });
    }

    onToggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
