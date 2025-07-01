import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-rendimiento',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './rendimiento.html',
    styleUrl: './rendimiento.scss'
})
export class RendimientoComponent {}
