import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-equipo-detalle',
  templateUrl: './equipo-detalle.html',
  styleUrls: ['./equipo-detalle.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule
  ]
})
export class EquipoDetalleComponent implements OnInit {
  equipo = {
    id: 1,
    nombre: 'Real Madrid FC',
    logo: 'https://via.placeholder.com/150',
    deporte: 'Fútbol',
    fundacion: '2010',
    categoria: 'Profesional',
    ubicacion: 'Madrid, España',
    entrenador: 'Carlos Ancelotti',
    estadio: 'Santiago Bernabéu',
    colores: ['Blanco', 'Azul'],
    descripcion: 'El Real Madrid Club de Fútbol, más conocido simplemente como Real Madrid, es una entidad polideportiva con sede en Madrid, España. Fue declarado oficialmente el mejor club de fútbol del siglo XX por la FIFA y el mejor club europeo de fútbol del siglo XX por la Unión de Asociaciones de Fútbol Europeas.',
    logros: [
      'Liga de Campeones 2022',
      'Supercopa de España 2022',
      'Liga Española 2021-2022',
      'Copa del Rey 2023'
    ]
  };
  
  jugadores = [
    {
      id: 1,
      nombre: 'Thibaut Courtois',
      posicion: 'Portero',
      numero: 1,
      nacionalidad: 'Bélgica',
      edad: 30,
      foto: 'https://via.placeholder.com/80',
      estadisticas: {
        partidos: 45,
        minutos: 4050,
        goles: 0,
        asistencias: 0
      }
    },
    {
      id: 2,
      nombre: 'Dani Carvajal',
      posicion: 'Defensa',
      numero: 2,
      nacionalidad: 'España',
      edad: 31,
      foto: 'https://via.placeholder.com/80',
      estadisticas: {
        partidos: 42,
        minutos: 3780,
        goles: 2,
        asistencias: 8
      }
    },
    {
      id: 3,
      nombre: 'Éder Militão',
      posicion: 'Defensa',
      numero: 3,
      nacionalidad: 'Brasil',
      edad: 25,
      foto: 'https://via.placeholder.com/80',
      estadisticas: {
        partidos: 40,
        minutos: 3600,
        goles: 3,
        asistencias: 1
      }
    },
    {
      id: 4,
      nombre: 'Toni Kroos',
      posicion: 'Centrocampista',
      numero: 8,
      nacionalidad: 'Alemania',
      edad: 33,
      foto: 'https://via.placeholder.com/80',
      estadisticas: {
        partidos: 44,
        minutos: 3960,
        goles: 5,
        asistencias: 12
      }
    },
    {
      id: 5,
      nombre: 'Vinícius Júnior',
      posicion: 'Delantero',
      numero: 7,
      nacionalidad: 'Brasil',
      edad: 23,
      foto: 'https://via.placeholder.com/80',
      estadisticas: {
        partidos: 48,
        minutos: 4320,
        goles: 24,
        asistencias: 18
      }
    }
  ];
  
  torneos = [
    {
      id: 1,
      nombre: 'Liga Española',
      temporada: '2024-2025',
      estado: 'En curso',
      posicion: 1,
      partidos: 28,
      victorias: 22,
      empates: 4,
      derrotas: 2,
      puntos: 70
    },
    {
      id: 2,
      nombre: 'Copa del Rey',
      temporada: '2024-2025',
      estado: 'Semifinal',
      posicion: null,
      partidos: 5,
      victorias: 4,
      empates: 1,
      derrotas: 0,
      puntos: null
    },
    {
      id: 3,
      nombre: 'Liga de Campeones',
      temporada: '2024-2025',
      estado: 'Cuartos de final',
      posicion: null,
      partidos: 8,
      victorias: 6,
      empates: 1,
      derrotas: 1,
      puntos: null
    }
  ];
  
  proximosPartidos = [
    {
      id: 1,
      rival: 'FC Barcelona',
      fecha: '2025-07-10',
      hora: '20:00',
      competicion: 'Liga Española',
      estadio: 'Santiago Bernabéu',
      local: true
    },
    {
      id: 2,
      rival: 'Atlético de Madrid',
      fecha: '2025-07-18',
      hora: '18:00',
      competicion: 'Copa del Rey',
      estadio: 'Wanda Metropolitano',
      local: false
    },
    {
      id: 3,
      rival: 'Bayern Munich',
      fecha: '2025-07-24',
      hora: '21:00',
      competicion: 'Liga de Campeones',
      estadio: 'Santiago Bernabéu',
      local: true
    }
  ];
  
  partidosRecientes = [
    {
      id: 1,
      rival: 'Sevilla FC',
      fecha: '2025-06-28',
      competicion: 'Liga Española',
      resultado: '3-1',
      victoria: true
    },
    {
      id: 2,
      rival: 'Manchester City',
      fecha: '2025-06-20',
      competicion: 'Liga de Campeones',
      resultado: '2-2',
      victoria: false
    },
    {
      id: 3,
      rival: 'Valencia CF',
      fecha: '2025-06-15',
      competicion: 'Liga Española',
      resultado: '4-0',
      victoria: true
    }
  ];
  
  estadisticasEquipo = {
    golesMarcados: 87,
    golesRecibidos: 28,
    victorias: 32,
    empates: 6,
    derrotas: 3,
    porcentajeVictorias: 78,
    posesionMedia: 63,
    tarjetasAmarillas: 45,
    tarjetasRojas: 2
  };
  
  constructor() { }

  ngOnInit(): void {
  }
  
  verDetallesJugador(id: number): void {
    console.log(`Ver detalles del jugador ${id}`);
    // Aquí iría la navegación a la página de detalles del jugador
  }
  
  obtenerColorResultado(victoria: boolean): string {
    return victoria ? '#4caf50' : '#f44336';
  }
}
