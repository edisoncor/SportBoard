import { Component } from '@angular/core';
import { Navigation } from '../navigation/navigation';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-sidebar',
    imports: [Navigation, MatCardModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {}
