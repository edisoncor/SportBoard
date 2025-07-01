import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-ajustes',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './ajustes.html',
    styleUrl: './ajustes.scss'
})
export class AjustesComponent {}
