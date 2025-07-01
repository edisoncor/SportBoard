import { Component } from '@angular/core';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { SharedModule } from './shared/shared-module';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Footer, Header, Sidebar, SharedModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected title = 'spa';
    public sidebarOpened = true;

    toggleSidebar() {
        this.sidebarOpened = !this.sidebarOpened;
    }
}
