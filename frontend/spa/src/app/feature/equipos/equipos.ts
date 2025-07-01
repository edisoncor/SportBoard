import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-equipos',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTabsModule, MatButtonModule],
    templateUrl: './equipos.html',
    styleUrl: './equipos.scss'
})
export class EquiposComponent {
    equipos = [
        {
            id: 1,
            nombre: 'Atlético Celeste',
            deporte: 'Fútbol',
            logo: 'https://ui-avatars.com/api/?name=AC&background=1e88e5&color=fff&size=128',
            colorPrimario: '#1e88e5',
            colorSecundario: '#64b5f6',
            jugadores: 24,
            fundacion: '2010',
            torneos: 3,
            victorias: 65,
            derrotas: 22,
            empates: 13,
            rendimiento: 75,
            estado: 'Activo',
            ultimosResultados: ['V', 'V', 'E', 'D', 'V'],
            proximoPartido: {
                rival: 'Deportivo Norte',
                fecha: '2025-07-05',
                hora: '16:00',
                torneo: 'Liga Nacional'
            }
        },
        {
            id: 2,
            nombre: 'Leones BC',
            deporte: 'Baloncesto',
            logo: 'https://ui-avatars.com/api/?name=LBC&background=ff9800&color=fff&size=128',
            colorPrimario: '#ff9800',
            colorSecundario: '#ffb74d',
            jugadores: 15,
            fundacion: '2012',
            torneos: 2,
            victorias: 48,
            derrotas: 32,
            empates: 0,
            rendimiento: 60,
            estado: 'Activo',
            ultimosResultados: ['V', 'D', 'D', 'V', 'V'],
            proximoPartido: {
                rival: 'Tigres BC',
                fecha: '2025-07-10',
                hora: '20:00',
                torneo: 'Campeonato Nacional'
            }
        },
        {
            id: 3,
            nombre: 'Club Natación Delfines',
            deporte: 'Natación',
            logo: 'https://ui-avatars.com/api/?name=CND&background=03a9f4&color=fff&size=128',
            colorPrimario: '#03a9f4',
            colorSecundario: '#4fc3f7',
            jugadores: 18,
            fundacion: '2008',
            torneos: 5,
            victorias: 22,
            derrotas: 8,
            empates: 0,
            rendimiento: 73,
            estado: 'Activo',
            ultimosResultados: ['V', 'V', 'V', 'D', 'V'],
            proximoPartido: null
        },
        {
            id: 4,
            nombre: 'Volley Stars',
            deporte: 'Voleibol',
            logo: 'https://ui-avatars.com/api/?name=VS&background=e53935&color=fff&size=128',
            colorPrimario: '#e53935',
            colorSecundario: '#ef5350',
            jugadores: 14,
            fundacion: '2015',
            torneos: 1,
            victorias: 28,
            derrotas: 12,
            empates: 0,
            rendimiento: 70,
            estado: 'Activo',
            ultimosResultados: ['D', 'V', 'V', 'V', 'D'],
            proximoPartido: {
                rival: 'Net Masters',
                fecha: '2025-07-15',
                hora: '18:30',
                torneo: 'Copa Regional'
            }
        },
        {
            id: 5,
            nombre: 'Running Team',
            deporte: 'Atletismo',
            logo: 'https://ui-avatars.com/api/?name=RT&background=9c27b0&color=fff&size=128',
            colorPrimario: '#9c27b0',
            colorSecundario: '#ba68c8',
            jugadores: 12,
            fundacion: '2013',
            torneos: 4,
            victorias: 15,
            derrotas: 5,
            empates: 0,
            rendimiento: 75,
            estado: 'Inactivo',
            ultimosResultados: ['V', 'V', 'D', 'V', 'D'],
            proximoPartido: null
        },
        {
            id: 6,
            nombre: 'Rugby Lions',
            deporte: 'Rugby',
            logo: 'https://ui-avatars.com/api/?name=RL&background=795548&color=fff&size=128',
            colorPrimario: '#795548',
            colorSecundario: '#a1887f',
            jugadores: 30,
            fundacion: '2005',
            torneos: 6,
            victorias: 42,
            derrotas: 18,
            empates: 10,
            rendimiento: 67,
            estado: 'Activo',
            ultimosResultados: ['E', 'V', 'E', 'V', 'D'],
            proximoPartido: {
                rival: 'Rhinos',
                fecha: '2025-07-12',
                hora: '15:00',
                torneo: 'Liga Rugby Pro'
            }
        }
    ];

    equiposFiltrados = this.equipos;
    deporteSeleccionado = 'Todos';

    filtrarPorDeporte(deporte: string) {
        this.deporteSeleccionado = deporte;
        
        if (deporte === 'Todos') {
            this.equiposFiltrados = this.equipos;
        } else {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo.deporte === deporte);
        }
    }

    deportesUnicos(): string[] {
        const deportes = this.equipos.map(equipo => equipo.deporte);
        return ['Todos', ...new Set(deportes)];
    }

    calcularPorcentajeVictorias(equipo: any): number {
        const totalPartidos = equipo.victorias + equipo.derrotas + equipo.empates;
        if (totalPartidos === 0) return 0;
        return Math.round((equipo.victorias / totalPartidos) * 100);
    }
}
