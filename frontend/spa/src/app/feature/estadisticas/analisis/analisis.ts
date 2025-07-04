import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-analisis',
    standalone: true,
    imports: [
        CommonModule, 
        MatIconModule, 
        MatCardModule, 
        MatSelectModule, 
        MatButtonModule, 
        MatTabsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './analisis.html',
    styleUrl: './analisis.scss'
})
export class AnalisisComponent {
    filtroPeriodo: string = 'temporada';
    filtroDeporte: string = 'todos';
    
    // Datos de ejemplo para estadísticas
    estadisticasDeporte = [
        { 
            deporte: 'Fútbol',
            partidos: 150,
            golesMarcados: 425,
            golesRecibidos: 385,
            posesionPromedio: 52,
            pasesPrecision: 78,
            tirosPuerta: 820,
            faltas: 340,
            tarjetas: { amarillas: 85, rojas: 12 }
        },
        { 
            deporte: 'Baloncesto',
            partidos: 120,
            puntosMarcados: 10540,
            puntosRecibidos: 9820,
            rebotes: 3250,
            asistencias: 2180,
            robos: 580,
            tapones: 320,
            triples: { intentos: 2450, aciertos: 820 }
        },
        { 
            deporte: 'Voleibol',
            partidos: 95,
            setsMarcados: 312,
            setsRecibidos: 280,
            aces: 420,
            bloqueos: 560,
            ataques: 3250,
            recepciones: 4800
        }
    ];
    
    tendenciasJuego = [
        { 
            nombre: 'Posesión de balón',
            valor: 54,
            tendencia: 'subida',
            cambio: 3
        },
        { 
            nombre: 'Efectividad de tiro',
            valor: 68,
            tendencia: 'estable',
            cambio: 0
        },
        { 
            nombre: 'Pases completados',
            valor: 82,
            tendencia: 'subida',
            cambio: 5
        },
        { 
            nombre: 'Recuperaciones',
            valor: 42,
            tendencia: 'bajada',
            cambio: -2
        },
        { 
            nombre: 'Jugadas a balón parado',
            valor: 75,
            tendencia: 'subida',
            cambio: 8
        }
    ];
    
    // Datos para informes predefinidos
    informes = [
        {
            titulo: 'Análisis de rendimiento por equipo',
            descripcion: 'Comparativa detallada del rendimiento de cada equipo con métricas avanzadas',
            tipo: 'equipo',
            icono: 'groups'
        },
        {
            titulo: 'Análisis de jugadores clave',
            descripcion: 'Evaluación profunda de los jugadores con mayor impacto en los resultados',
            tipo: 'jugador',
            icono: 'person'
        },
        {
            titulo: 'Tendencias tácticas por deporte',
            descripcion: 'Análisis de las estrategias y tácticas más efectivas por deporte',
            tipo: 'tactica',
            icono: 'psychology'
        },
        {
            titulo: 'Predicción de resultados',
            descripcion: 'Modelo predictivo basado en datos históricos y estadísticas actuales',
            tipo: 'prediccion',
            icono: 'insights'
        },
        {
            titulo: 'Análisis de lesiones',
            descripcion: 'Estudio de patrones de lesiones y su impacto en el rendimiento',
            tipo: 'salud',
            icono: 'healing'
        },
        {
            titulo: 'Evolución de torneos',
            descripcion: 'Seguimiento detallado del desarrollo de los torneos activos',
            tipo: 'torneo',
            icono: 'emoji_events'
        }
    ];
    
    // Lista de filtros disponibles
    filtrosPeriodo = [
        { valor: 'temporada', nombre: 'Temporada actual' },
        { valor: 'mes', nombre: 'Último mes' },
        { valor: 'semana', nombre: 'Última semana' },
        { valor: 'personalizado', nombre: 'Período personalizado' }
    ];
    
    filtrosDeporte = [
        { valor: 'todos', nombre: 'Todos los deportes' },
        { valor: 'futbol', nombre: 'Fútbol' },
        { valor: 'baloncesto', nombre: 'Baloncesto' },
        { valor: 'voleibol', nombre: 'Voleibol' },
        { valor: 'tenis', nombre: 'Tenis' },
        { valor: 'natacion', nombre: 'Natación' }
    ];
    
    obtenerIconoTendencia(tendencia: string): string {
        switch(tendencia) {
            case 'subida': return 'trending_up';
            case 'bajada': return 'trending_down';
            default: return 'trending_flat';
        }
    }
    
    obtenerClaseTendencia(tendencia: string): string {
        switch(tendencia) {
            case 'subida': return 'tendencia-positiva';
            case 'bajada': return 'tendencia-negativa';
            default: return 'tendencia-estable';
        }
    }
    
    generarInforme(tipo: string): void {
        console.log(`Generando informe de tipo: ${tipo}`);
        // Aquí iría la lógica para generar el informe
    }
    
    exportarDatos(formato: string): void {
        console.log(`Exportando datos en formato: ${formato}`);
        // Aquí iría la lógica para exportar los datos
    }
}
