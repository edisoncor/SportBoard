import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface ProximoPartido {
    local: string;
    visitante: string;
    fecha: string;
    hora: string;
}

interface Torneo {
    id: number;
    nombre: string;
    deporte: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    equipos: number;
    partidos: number;
    partidosJugados: number;
    logo: string;
    colorPrimario: string;
    patrocinadores: string[];
    proximoPartido: ProximoPartido | null;
}

@Component({
    selector: 'app-torneos',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTabsModule, MatBadgeModule, FormsModule],
    templateUrl: './torneos.html',
    styleUrl: './torneos.scss'
})
export class TorneosComponent {
    torneos: Torneo[] = [
        {
            id: 1,
            nombre: 'Liga Nacional de Fútbol',
            deporte: 'Fútbol',
            fechaInicio: '2025-01-15',
            fechaFin: '2025-06-30',
            estado: 'En curso',
            equipos: 16,
            partidos: 240,
            partidosJugados: 120,
            logo: 'sports_soccer',
            colorPrimario: '#1e88e5',
            patrocinadores: ['Nike', 'Coca-Cola', 'Samsung'],
            proximoPartido: {
                local: 'Equipo A',
                visitante: 'Equipo B',
                fecha: '2025-07-05',
                hora: '18:00'
            }
        },
        {
            id: 2,
            nombre: 'Campeonato de Baloncesto',
            deporte: 'Baloncesto',
            fechaInicio: '2025-03-10',
            fechaFin: '2025-08-15',
            estado: 'En curso',
            equipos: 12,
            partidos: 132,
            partidosJugados: 68,
            logo: 'sports_basketball',
            colorPrimario: '#ff9800',
            patrocinadores: ['Adidas', 'Pepsi', 'LG'],
            proximoPartido: {
                local: 'Equipo C',
                visitante: 'Equipo D',
                fecha: '2025-07-08',
                hora: '20:00'
            }
        },
        {
            id: 3,
            nombre: 'Torneo Regional de Tenis',
            deporte: 'Tenis',
            fechaInicio: '2025-05-01',
            fechaFin: '2025-05-15',
            estado: 'Finalizado',
            equipos: 32,
            partidos: 31,
            partidosJugados: 31,
            logo: 'sports_tennis',
            colorPrimario: '#4caf50',
            patrocinadores: ['Wilson', 'Rolex', 'Emirates'],
            proximoPartido: null
        },
        {
            id: 4,
            nombre: 'Copa de Voleibol',
            deporte: 'Voleibol',
            fechaInicio: '2025-08-15',
            fechaFin: '2025-10-30',
            estado: 'Próximamente',
            equipos: 8,
            partidos: 28,
            partidosJugados: 0,
            logo: 'sports_volleyball',
            colorPrimario: '#e53935',
            patrocinadores: ['Mizuno', 'Red Bull', 'Sony'],
            proximoPartido: {
                local: 'Equipo E',
                visitante: 'Equipo F',
                fecha: '2025-08-15',
                hora: '19:30'
            }
        },
        {
            id: 5,
            nombre: 'Maratón Anual',
            deporte: 'Atletismo',
            fechaInicio: '2025-09-10',
            fechaFin: '2025-09-10',
            estado: 'Próximamente',
            equipos: 150,
            partidos: 1,
            partidosJugados: 0,
            logo: 'directions_run',
            colorPrimario: '#9c27b0',
            patrocinadores: ['Asics', 'Gatorade', 'BMW'],
            proximoPartido: null
        },
        {
            id: 6,
            nombre: 'Campeonato de Natación',
            deporte: 'Natación',
            fechaInicio: '2025-02-20',
            fechaFin: '2025-02-25',
            estado: 'Finalizado',
            equipos: 25,
            partidos: 15,
            partidosJugados: 15,
            logo: 'pool',
            colorPrimario: '#03a9f4',
            patrocinadores: ['Speedo', 'Omega', 'Visa'],
            proximoPartido: null
        }
    ];

    torneosFiltrados: Torneo[] = this.torneos;
    filtroActual = 'todos';
    terminoBusqueda = '';

    // Getters para contar torneos por estado
    get totalTorneos(): number {
        return this.torneos.length;
    }

    get torneosEnCurso(): number {
        return this.torneos.filter(t => t.estado === 'En curso').length;
    }

    get torneosFuturos(): number {
        return this.torneos.filter(t => t.estado === 'Próximamente').length;
    }

    get torneosFinalizados(): number {
        return this.torneos.filter(t => t.estado === 'Finalizado').length;
    }

    filtrarTorneos(filtro: string): void {
        this.filtroActual = filtro;
        this.aplicarFiltros();
    }

    buscarTorneos(): void {
        // Agregar un pequeño retraso para evitar demasiadas actualizaciones durante el tipeo
        setTimeout(() => {
            this.aplicarFiltros();
        }, 300);
    }

    private aplicarFiltros(): void {
        let resultado = this.torneos;
        
        // Aplicar filtro por estado
        if (this.filtroActual !== 'todos') {
            resultado = resultado.filter(torneo => 
                torneo.estado.toLowerCase() === this.filtroActual);
        }
        
        // Aplicar búsqueda por texto
        if (this.terminoBusqueda.trim() !== '') {
            const termino = this.terminoBusqueda.toLowerCase();
            resultado = resultado.filter(torneo => 
                torneo.nombre.toLowerCase().includes(termino) || 
                torneo.deporte.toLowerCase().includes(termino));
        }
        
        this.torneosFiltrados = resultado;
    }

    obtenerPorcentajeCompletado(torneo: Torneo): number {
        if (torneo.partidos === 0) return 0;
        return Math.round((torneo.partidosJugados / torneo.partidos) * 100);
    }
}
