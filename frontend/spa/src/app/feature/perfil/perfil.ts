import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './perfil.html',
    styleUrl: './perfil.scss'
})
export class PerfilComponent {}
