import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatChipsModule
  ]
})
export class CalendarioComponent implements OnInit {
  diasSemana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  mesSeleccionado = 6; // Julio (0-indexed)
  anoSeleccionado = 2025;
  
  diasCalendario: any[] = [];
  vistaActual = 'mes'; // 'mes' o 'semana'
  
  eventosCalendario = [
    { 
      id: 1, 
      titulo: 'Final Copa Universitaria', 
      fecha: '2025-07-15', 
      hora: '16:00', 
      deporte: 'Fútbol', 
      tipo: 'torneo',
      color: '#4caf50',
      ubicacion: 'Estadio Principal'
    },
    { 
      id: 2, 
      titulo: 'Torneo de Baloncesto', 
      fecha: '2025-07-18', 
      hora: '14:00', 
      deporte: 'Baloncesto', 
      tipo: 'torneo',
      color: '#2196f3',
      ubicacion: 'Coliseo Deportivo'
    },
    { 
      id: 3, 
      titulo: 'Campeonato de Natación', 
      fecha: '2025-07-22', 
      hora: '09:00', 
      deporte: 'Natación', 
      tipo: 'campeonato',
      color: '#9c27b0',
      ubicacion: 'Centro Acuático'
    },
    { 
      id: 4, 
      titulo: 'Entrenamiento Equipo A', 
      fecha: '2025-07-08', 
      hora: '17:00', 
      deporte: 'Fútbol', 
      tipo: 'entrenamiento',
      color: '#ff9800',
      ubicacion: 'Campo de Entrenamiento'
    },
    { 
      id: 5, 
      titulo: 'Reunión Entrenadores', 
      fecha: '2025-07-05', 
      hora: '10:00', 
      tipo: 'reunión',
      color: '#607d8b',
      ubicacion: 'Sala de Conferencias'
    },
    { 
      id: 6, 
      titulo: 'Liga de Voleibol', 
      fecha: '2025-07-02', 
      hora: '18:00', 
      deporte: 'Voleibol', 
      tipo: 'liga',
      color: '#e91e63',
      ubicacion: 'Gimnasio Principal'
    },
    { 
      id: 7, 
      titulo: 'Maratón Universitaria', 
      fecha: '2025-07-25', 
      hora: '07:00', 
      deporte: 'Atletismo', 
      tipo: 'competición',
      color: '#8bc34a',
      ubicacion: 'Campus Universitario'
    }
  ];
  
  filtroDeportes = 'todos';
  deportes = ['Fútbol', 'Baloncesto', 'Natación', 'Voleibol', 'Atletismo'];
  
  constructor() { }

  ngOnInit(): void {
    this.generarCalendario();
  }
  
  generarCalendario(): void {
    this.diasCalendario = [];
    
    // Obtener el primer día del mes seleccionado
    const primerDia = new Date(this.anoSeleccionado, this.mesSeleccionado, 1);
    const ultimoDia = new Date(this.anoSeleccionado, this.mesSeleccionado + 1, 0);
    
    // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
    let diaSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;
    
    // Días del mes anterior para completar la primera semana
    for (let i = diaSemana; i > 0; i--) {
      const fecha = new Date(this.anoSeleccionado, this.mesSeleccionado, 1 - i);
      this.diasCalendario.push({
        dia: fecha.getDate(),
        esMesActual: false,
        fecha: this.formatearFecha(fecha),
        eventos: this.obtenerEventosDia(fecha)
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const fecha = new Date(this.anoSeleccionado, this.mesSeleccionado, i);
      this.diasCalendario.push({
        dia: i,
        esMesActual: true,
        fecha: this.formatearFecha(fecha),
        eventos: this.obtenerEventosDia(fecha)
      });
    }
    
    // Completar la última semana con días del mes siguiente
    const diasRestantes = 7 - (this.diasCalendario.length % 7);
    if (diasRestantes < 7) {
      for (let i = 1; i <= diasRestantes; i++) {
        const fecha = new Date(this.anoSeleccionado, this.mesSeleccionado + 1, i);
        this.diasCalendario.push({
          dia: i,
          esMesActual: false,
          fecha: this.formatearFecha(fecha),
          eventos: this.obtenerEventosDia(fecha)
        });
      }
    }
  }
  
  obtenerEventosDia(fecha: Date): any[] {
    const fechaStr = this.formatearFecha(fecha);
    return this.eventosCalendario
      .filter(evento => {
        const coincideFecha = evento.fecha === fechaStr;
        const coincideDeporte = this.filtroDeportes === 'todos' || 
                                (evento.deporte && evento.deporte === this.filtroDeportes);
        return coincideFecha && coincideDeporte;
      });
  }
  
  formatearFecha(fecha: Date): string {
    const ano = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
  
  cambiarMes(incremento: number): void {
    this.mesSeleccionado += incremento;
    
    if (this.mesSeleccionado > 11) {
      this.mesSeleccionado = 0;
      this.anoSeleccionado++;
    } else if (this.mesSeleccionado < 0) {
      this.mesSeleccionado = 11;
      this.anoSeleccionado--;
    }
    
    this.generarCalendario();
  }
  
  irAlMesActual(): void {
    const fechaActual = new Date();
    this.mesSeleccionado = fechaActual.getMonth();
    this.anoSeleccionado = fechaActual.getFullYear();
    this.generarCalendario();
  }
  
  cambiarVista(vista: string): void {
    this.vistaActual = vista;
  }
  
  cambiarFiltroDeporte(deporte: string): void {
    this.filtroDeportes = deporte;
    this.generarCalendario();
  }
  
  verDetallesEvento(evento: any): void {
    console.log('Ver detalles del evento:', evento);
    // Aquí iría la navegación a la página de detalles del evento
  }

  getDayOfWeek(fechaStr: string): number {
    const fecha = new Date(fechaStr);
    return fecha.getDay() === 0 ? 6 : fecha.getDay() - 1;
  }

  parseIntFromString(value: string): number {
    return parseInt(value, 10);
  }

  calcularPosicionEvento(horaEvento: string): number {
    const horaParts = horaEvento.split(':');
    const hora = parseInt(horaParts[0], 10);
    const minutos = parseInt(horaParts[1], 10);
    return (hora - 8) * 60 + minutos;
  }

  esHoraVisible(horaEvento: string): boolean {
    const hora = parseInt(horaEvento.split(':')[0], 10);
    return hora >= 8 && hora <= 20;
  }
}
