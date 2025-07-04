import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule
  ]
})
export class EventosComponent implements OnInit {
  eventosProximos = [
    {
      id: 1,
      titulo: 'Final Copa Universitaria',
      deporte: 'Fútbol',
      icono: 'sports_soccer',
      lugar: 'Estadio Principal',
      horario: '16:00 - 18:00',
      fecha: '2025-07-15',
      dia: '15',
      mes: 'JUL',
      equipos: ['Universidad A', 'Universidad B'],
      estado: 'proximo'
    },
    {
      id: 2,
      titulo: 'Torneo de Baloncesto',
      deporte: 'Baloncesto',
      icono: 'sports_basketball',
      lugar: 'Coliseo Deportivo',
      horario: '14:00 - 20:00',
      fecha: '2025-07-18',
      dia: '18',
      mes: 'JUL',
      equipos: ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D'],
      estado: 'proximo'
    },
    {
      id: 3,
      titulo: 'Campeonato de Natación',
      deporte: 'Natación',
      icono: 'pool',
      lugar: 'Centro Acuático',
      horario: '09:00 - 13:00',
      fecha: '2025-07-22',
      dia: '22',
      mes: 'JUL',
      equipos: ['Club Acuático A', 'Club Acuático B'],
      estado: 'proximo'
    },
    {
      id: 4,
      titulo: 'Torneo de Tenis',
      deporte: 'Tenis',
      icono: 'sports_tennis',
      lugar: 'Club de Tenis',
      horario: '10:00 - 17:00',
      fecha: '2025-07-25',
      dia: '25',
      mes: 'JUL',
      equipos: ['Tenistas A', 'Tenistas B'],
      estado: 'proximo'
    }
  ];

  eventosEnCurso = [
    {
      id: 5,
      titulo: 'Liga de Voleibol',
      deporte: 'Voleibol',
      icono: 'sports_volleyball',
      lugar: 'Gimnasio Principal',
      horario: '18:00 - 21:00',
      fecha: '2025-07-02',
      dia: '02',
      mes: 'JUL',
      equipos: ['Vóleibol A', 'Vóleibol B'],
      estado: 'en curso',
      resultado: {
        equipo1: { nombre: 'Vóleibol A', puntos: 2 },
        equipo2: { nombre: 'Vóleibol B', puntos: 1 }
      }
    },
    {
      id: 6,
      titulo: 'Campeonato de Atletismo',
      deporte: 'Atletismo',
      icono: 'directions_run',
      lugar: 'Pista Olimpica',
      horario: '08:00 - 18:00',
      fecha: '2025-07-02',
      dia: '02',
      mes: 'JUL',
      equipos: ['Club Atlético A', 'Club Atlético B', 'Club Atlético C'],
      estado: 'en curso'
    }
  ];

  eventosFinalizados = [
    {
      id: 7,
      titulo: 'Torneo de Ajedrez',
      deporte: 'Ajedrez',
      icono: 'extension',
      lugar: 'Salón de Eventos',
      horario: '10:00 - 16:00',
      fecha: '2025-06-28',
      dia: '28',
      mes: 'JUN',
      equipos: ['Club de Ajedrez A', 'Club de Ajedrez B'],
      estado: 'finalizado',
      resultado: {
        ganador: 'Club de Ajedrez A',
        puntuacion: '3-1'
      }
    },
    {
      id: 8,
      titulo: 'Maratón Universitaria',
      deporte: 'Atletismo',
      icono: 'directions_run',
      lugar: 'Campus Universitario',
      horario: '07:00 - 12:00',
      fecha: '2025-06-25',
      dia: '25',
      mes: 'JUN',
      equipos: ['Universidad A', 'Universidad B', 'Universidad C'],
      estado: 'finalizado',
      resultado: {
        ganador: 'Universidad B',
        tiempo: '2h 14m 32s'
      }
    }
  ];

  filtroActual = 'todos';

  constructor() { }

  ngOnInit(): void {
  }

  filtrarEventos(filtro: string): void {
    this.filtroActual = filtro;
  }

  verDetalles(id: number): void {
    console.log(`Ver detalles del evento ${id}`);
    // Aqui iria la navegación a la página de detalles del evento
  }

  obtenerEstiloChip(estado: string): object {
    switch (estado) {
      case 'proximo':
        return { 'background-color': '#4caf50', color: 'white' };
      case 'en curso':
        return { 'background-color': '#2196f3', color: 'white' };
      case 'finalizado':
        return { 'background-color': '#9e9e9e', color: 'white' };
      default:
        return {};
    }
  }
}
