import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
    fechaActual: Date = new Date();
  nombreMesActual: string = '';
  anioActual: number = 0;
  diasCalendario: any[] = [];
  constructor(private router: Router) {}
  // Datos de ejemplo de partidos
  private partidos = [
    { fecha: new Date(2024, 9, 3), equipoLocal: 'Barcelona SC', marcadorLocal: 5, equipoVisitante: 'Emelec', marcadorVisitante: 0 },
    { fecha: new Date(2024, 9, 5), equipoLocal: 'Libertad FC', marcadorLocal: 2, equipoVisitante: 'Guayaquil City', marcadorVisitante: 0 }
  ];

  ngOnInit() {
    this.generarCalendario();
  }

  generarCalendario() {
    const primerDiaDelMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
    const ultimoDiaDelMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0);

    this.nombreMesActual = primerDiaDelMes.toLocaleString('default', { month: 'long' });
    this.anioActual = primerDiaDelMes.getFullYear();

    const diaSemanaInicio = primerDiaDelMes.getDay();
    const semanas: any[] = [];
    let semanaActual: any[] = [];

    // Agregar celdas vacías antes del primer día del mes
    for (let i = 0; i < diaSemanaInicio; i++) {
      semanaActual.push({ fecha: '', esmesMesActual: false, partidos: [] });
    }

    // Agregar días del mes
    for (let dia = 1; dia <= ultimoDiaDelMes.getDate(); dia++) {
      const diaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), dia);
      const partidosDia = this.partidos.filter(partido =>
        partido.fecha.getFullYear() === diaActual.getFullYear() &&
        partido.fecha.getMonth() === diaActual.getMonth() &&
        partido.fecha.getDate() === diaActual.getDate()
      );

      semanaActual.push({
        fecha: dia,
        esmesMesActual: true,
        partidos: partidosDia
      });

      if (semanaActual.length === 7) {
        semanas.push(semanaActual);
        semanaActual = [];
      }
    }

    // Agregar celdas vacías después del último día del mes
    if (semanaActual.length > 0) {
      while (semanaActual.length < 7) {
        semanaActual.push({ fecha: '', esmesMesActual: false, partidos: [] });
      }
      semanas.push(semanaActual);
    }

    this.diasCalendario = semanas;
  }

  cambiarMes(incremento: number) {
    this.fechaActual = new Date(
      this.fechaActual.getFullYear(),
      this.fechaActual.getMonth() + incremento,
      1
    );
    this.generarCalendario();
  }
  cambiarVista(event: Event): void {
  const seleccion = (event.target as HTMLSelectElement).value;
  console.log(`Vista cambiada a: ${seleccion}`);
  // Aquí puedes agregar lógica específica para manejar las vistas.
  switch (seleccion) {
    case 'mes':
      console.log('Vista mensual seleccionada');
      break;
    case 'semana':
      console.log('Vista semanal seleccionada');
      break;
    case 'dia':
      console.log('Vista diaria seleccionada');
      break;
    default:
      console.log('Vista desconocida seleccionada');
      break;
  }
}

  // Métodos adicionales para manejar las nuevas funcionalidades
  crearPartido() {
    console.log('Crear partido: mostrar formulario o redirigir a otra vista');
  }


  navigateToGroups() {
    console.log('Navegar a la página de grupos');
    this.router.navigate(['/calendario/sorteo']);
  }

  gestionarPartidos() {
    console.log('Gestionar partidos: mostrar la vista de gestión');
    this.router.navigate(['/calendario/matchtable']);
  }
  equipos = [
  { id: 1, nombre: 'Barcelona SC' },
  { id: 2, nombre: 'Emelec' },
  { id: 3, nombre: 'Guayaquil City' }
];

categorias = [
  { id: 1, nombre: 'Primera' },
  { id: 2, nombre: 'Segunda' }
];

torneos = [
  { id: 1, nombre: 'Torneo Apertura' },
  { id: 2, nombre: 'Torneo Clausura' }
];

temporadas = [
  { id: 1, nombre: '2023/2024' },
  { id: 2, nombre: '2024/2025' }
];
filtrarEquipo(event: Event) {
  const idEquipo = (event.target as HTMLSelectElement).value;
  console.log('Filtrar por equipo con ID:', idEquipo);
  // Aquí la lógica para filtrar partidos por equipo
}

filtrarCategoria(event: Event) {
  const idCategoria = (event.target as HTMLSelectElement).value;
  console.log('Filtrar por categoría con ID:', idCategoria);
}

filtrarTorneo(event: Event) {
  const idTorneo = (event.target as HTMLSelectElement).value;
  console.log('Filtrar por torneo con ID:', idTorneo);
}

filtrarTemporada(event: Event) {
  const idTemporada = (event.target as HTMLSelectElement).value;
  console.log('Filtrar por temporada con ID:', idTemporada);
}
editarPartido(partido: any) {
  console.log('Editar partido:', partido);
  // Lógica para editar el partido
}

eliminarPartido(partido: any) {
  console.log('Eliminar partido:', partido);
  // Lógica para eliminar el partido
  this.partidos = this.partidos.filter(p => p !== partido);
  this.generarCalendario(); // Actualizar el calendario
}
}
