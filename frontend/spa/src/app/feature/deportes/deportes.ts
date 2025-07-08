import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-deportes',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule],
    templateUrl: './deportes.html',
    styleUrl: './deportes.scss'
})
export class DeportesComponent {
    deportes = [
        {
            id: 1,
            nombre: 'Fútbol',
            icono: 'sports_soccer',
            descripcion: 'El deporte más popular del mundo, jugado por dos equipos de 11 jugadores cada uno.',
            popularidad: 95,
            torneos: 8,
            equipos: 24,
            color: '#1e88e5'
        },
        {
            id: 2,
            nombre: 'Baloncesto',
            icono: 'sports_basketball',
            descripcion: 'Deporte de equipo donde dos conjuntos de cinco jugadores intentan anotar puntos.',
            popularidad: 87,
            torneos: 6,
            equipos: 18,
            color: '#ff9800'
        },
        {
            id: 3,
            nombre: 'Tenis',
            icono: 'sports_tennis',
            descripcion: 'Deporte de raqueta que se puede jugar individualmente o en parejas.',
            popularidad: 82,
            torneos: 5,
            equipos: 12,
            color: '#4caf50'
        },
        {
            id: 4,
            nombre: 'Voleibol',
            icono: 'sports_volleyball',
            descripcion: 'Deporte donde dos equipos separados por una red alta compiten por puntos.',
            popularidad: 78,
            torneos: 4,
            equipos: 16,
            color: '#e53935'
        },
        {
            id: 5,
            nombre: 'Natación',
            icono: 'pool',
            descripcion: 'Deporte acuático que consiste en el desplazamiento de una persona en el agua.',
            popularidad: 75,
            torneos: 3,
            equipos: 10,
            color: '#03a9f4'
        },
        {
            id: 6,
            nombre: 'Atletismo',
            icono: 'directions_run',
            descripcion: 'Conjunto de disciplinas deportivas que comprenden carreras, saltos y lanzamientos.',
            popularidad: 72,
            torneos: 3,
            equipos: 8,
            color: '#9c27b0'
        },
        {
            id: 7,
            nombre: 'Rugby',
            icono: 'sports_rugby',
            descripcion: 'Deporte de contacto en equipo que se juega con un balón ovalado.',
            popularidad: 65,
            torneos: 2,
            equipos: 12,
            color: '#795548'
        },
        {
            id: 8,
            nombre: 'Hockey',
            icono: 'sports_hockey',
            descripcion: 'Deporte en el que dos equipos compiten para llevar un disco o pelota a la portería contraria.',
            popularidad: 60,
            torneos: 2,
            equipos: 8,
            color: '#607d8b'
        }
    ];
}
