import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/calendar/team.service';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';

interface Team {
  id: number;
  name: string;
}

interface Partido {
  id: number;
  fecha: Date;
  equipoLocal: Team;
  marcadorLocal: number;
  equipoVisitante: Team;
  marcadorVisitante: number;
  equipoSeleccionado?: Team;
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, SharedModule, FormsModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
    mostrarFormulario: boolean = false;
    fechaActual: Date = new Date();
    nombreMesActual: string = '';
    anioActual: number = 0;
    diasCalendario: any[] = [];
    calendarios: string[] = [];
    partidosData: Partido[] = [];
    equipos: Team[] = [];
    equiposFiltrados: Team[] = [];  // Equipos filtrados
    equipoSeleccionado: string = '';  // Almacena el equipo seleccionado para el filtro
    fechaPartido: Date = new Date(); // Fecha y hora del partido
    equipoLocalSeleccionado: Team | null = null;
    equipoVisitanteSeleccionado: Team | null = null;
    marcadorLocal: number = 0; // Marcador del equipo local
    marcadorVisitante: number = 0; // Marcador del equipo visitante
    diaSeleccionado: any = null;
    equiposData: string[] = [];
    constructor(
        private router: Router,
        private teamService: TeamService
    ) {
    }

    ngOnInit(): void {
        this.cargarCalendarios();
        this.generarCalendario();
        this.teamService.getEquipos().subscribe({
            next: (data) => {
                console.log('Equipos recibidos:', data);
                this.equipos = data;  // Asignar la lista de equipos a la propiedad 'equipos'
                this.equiposFiltrados = data;
                this.asignarEnfrentamientosAleatorios();  // Asignar enfrentamientos aleatorios
            },
            error: (error) => {
                console.error('Error al obtener equipos:', error);
            }
        });
    }
    asignarEnfrentamientosAleatorios() {
        const equiposDisponibles = [...this.equipos]; // Copiar la lista de equipos para evitar modificarla directamente
        const partidos: Partido[] = [];
        let idPartido = 1; // Inicializamos el ID para los partidos

        while (equiposDisponibles.length >= 2) {
            // Tomar dos equipos aleatorios para el enfrentamiento
            const equipoLocal = equiposDisponibles.splice(Math.floor(Math.random() * equiposDisponibles.length), 1)[0];
            const equipoVisitante = equiposDisponibles.splice(Math.floor(Math.random() * equiposDisponibles.length), 1)[0];

            // Crear un partido con fecha aleatoria (en este caso, del mes actual)
            const fechaAleatoria = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), Math.floor(Math.random() * 30) + 1);
            const partido: Partido = {
                id: idPartido++, // Asignar un ID único incremental
                fecha: fechaAleatoria,
                equipoLocal,
                marcadorLocal: 0,
                equipoVisitante,
                marcadorVisitante: 0
            };

            partidos.push(partido);  // Agregar partido al array
        }

        // Asignar los partidos generados al calendario
        this.partidosData = partidos;
        console.log('Partidos asignados aleatoriamente:', this.partidosData);
        this.generarCalendario();  // Regenerar el calendario con los partidos asignados
    }

    mostrarPartidosDelDia(dia: any) {
        this.diaSeleccionado = dia;
        const partidosDelDia = this.partidosData.filter(partido => {
            const partidoFecha = new Date(partido.fecha);
            return partidoFecha.getDate() === dia && 
                   partidoFecha.getMonth() === this.fechaActual.getMonth() && 
                   partidoFecha.getFullYear() === this.fechaActual.getFullYear();
        });

        if (partidosDelDia.length > 0) {
            const partido = partidosDelDia[0];
            console.log(`Partido del ${dia}: ${partido.equipoLocal.name} vs ${partido.equipoVisitante.name}`);
        }
    }



    cerrarModalPartidos() {
        this.diaSeleccionado = null;
    }
    private cargarCalendarios() {
        this.teamService.getAllCalendars().subscribe({
            next: (calendarios) => {
                console.log('Calendarios raw:', calendarios);

                this.partidosData = calendarios.map(calendario => {
                    const partidoData = typeof calendario === 'string' ?
                        JSON.parse(calendario) : calendario;

                    const fecha = new Date(partidoData.fecha);
                    console.log('Fecha procesada:', fecha);

                    return {
                        id: partidoData.id,
                        fecha: fecha,
                        equipoLocal: partidoData.equipoLocal,
                        marcadorLocal: partidoData.marcadorLocal,
                        equipoVisitante: partidoData.equipoVisitante,
                        marcadorVisitante: partidoData.marcadorVisitante,
                        equipoSeleccionado: partidoData.equipoSeleccionado
                    };
                });

                console.log('PartidosData procesado:', this.partidosData);
                this.generarCalendario();
            },
            error: (error) => {
                console.error('Error al cargar calendarios:', error);
            }
        });
    }
    filtrarEquiposLocal(event: any) {
        const equipoSeleccionado = event.target.value;
        this.equipoLocalSeleccionado = equipoSeleccionado;

        // Actualizar equipos disponibles para visitante
        if (equipoSeleccionado) {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo !== equipoSeleccionado);
        } else {
            this.equiposFiltrados = [...this.equipos];
        }
    }

    filtrarEquiposVisitante(event: any) {
        this.equipoVisitanteSeleccionado = event.target.value;
    }

    // Actualizar los equipos disponibles en cada campo según la selección
    actualizarEquiposDisponibles() {
        // Si se selecciona un equipo en el local, eliminar ese equipo de los disponibles para el visitante
        if (this.equipoLocalSeleccionado) {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo !== this.equipoLocalSeleccionado);
        } else {
            this.equiposFiltrados = [...this.equipos]; // Restaurar todos los equipos si no se selecciona un local
        }

        // Si se selecciona un equipo en el visitante, eliminar ese equipo de los disponibles para el local
        if (this.equipoVisitanteSeleccionado) {
            this.equiposFiltrados = this.equiposFiltrados.filter(equipo => equipo !== this.equipoVisitanteSeleccionado);
        }
    }

    crearPartido() {
        if (!this.equipoLocalSeleccionado || !this.equipoVisitanteSeleccionado || !this.fechaPartido) {
            console.error("Debe seleccionar ambos equipos y la fecha.");
            return;
        }

        // Sumamos un día a la fecha seleccionada
        const fechaPartidoDate = new Date(this.fechaPartido);
        fechaPartidoDate.setDate(fechaPartidoDate.getDate() + 1);  // Sumar un día

        if (isNaN(fechaPartidoDate.getTime())) {
            console.error("La fecha seleccionada no es válida.");
            return;
        }

        const partido: Partido = {
            id: this.partidosData.length + 1,  // ID único incremental
            fecha: fechaPartidoDate,  // Utilizamos la fecha con un día agregado
            equipoLocal: this.equipoLocalSeleccionado,
            marcadorLocal: this.marcadorLocal,
            equipoVisitante: this.equipoVisitanteSeleccionado,
            marcadorVisitante: this.marcadorVisitante,
            equipoSeleccionado: this.equipoLocalSeleccionado || this.equipoVisitanteSeleccionado
        };

        this.partidosData.push(partido);

        // Formatear la fecha antes de enviarla como string al backend
        const partidoString = JSON.stringify({
            ...partido,
            fecha: this.formatearFecha(partido.fecha)  // Formatea la fecha antes de enviarla
        });

        this.teamService.createCalendar(partidoString).subscribe({
            next: (calendario) => {
                console.log('Calendario creado:', calendario);
                this.cargarCalendarios();
            },
            error: (error) => {
                console.error('Error al crear calendario:', error);
            }
        });

        this.mostrarFormulario = false;
    }



    generarCalendario() {
        const primerDiaDelMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
        const ultimoDiaDelMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0);

        this.nombreMesActual = primerDiaDelMes.toLocaleString('default', {month: 'long'});
        this.anioActual = primerDiaDelMes.getFullYear();

        const diaSemanaInicio = primerDiaDelMes.getDay();
        const semanas: any[] = [];
        let semanaActual: any[] = [];

        // Agregar celdas vacías antes del primer día del mes
        for (let i = 0; i < diaSemanaInicio; i++) {
            semanaActual.push({fecha: '', esmesMesActual: false, partidos: []});
        }

        // Agregar días del mes
        for (let dia = 1; dia <= ultimoDiaDelMes.getDate(); dia++) {
            const diaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), dia);

            // Filtrar partidos para este día
            const partidosDia = this.partidosData.filter(partido => {
                const partidoFecha = new Date(partido.fecha);
                return partidoFecha.getDate() === diaActual.getDate() &&
                    partidoFecha.getMonth() === diaActual.getMonth() &&
                    partidoFecha.getFullYear() === diaActual.getFullYear();
            });



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
                semanaActual.push({fecha: '', esmesMesActual: false, partidos: []});
            }
            semanas.push(semanaActual);
        }

        this.diasCalendario = semanas;
        console.log('Calendario generado:', this.diasCalendario); // Para debug
    }

    formatearFecha(fecha: any): string {
        // Si 'fecha' es un string, conviértelo a Date
        const fechaDate = new Date(fecha);  // Convertimos a Date si es necesario

        // Verifica que la conversión fue exitosa
        if (isNaN(fechaDate.getTime())) {
            console.error("La fecha es inválida:", fecha);
            return "";
        }

        const year = fechaDate.getFullYear();
        const month = ('0' + (fechaDate.getMonth() + 1)).slice(-2);  // Mes con dos dígitos
        const day = ('0' + fechaDate.getDate()).slice(-2);  // Día con dos dígitos
        return `${year}-${month}-${day}`;
    }

    eliminarPartido(id: number) {
        // Llamamos a getEquipos para obtener los equipos y luego decidimos qué partido eliminar
        this.teamService.getEquipos().subscribe({
            next: (equipos) => {
                console.log('Equipos obtenidos:', equipos);
                // Encontramos el partido con el ID proporcionado
                const partidoAEliminar = this.partidosData.find(partido => partido.id === id);

                if (partidoAEliminar) {
                    console.log('Partido a eliminar:', partidoAEliminar);
                    // Filtrar los partidos que no coinciden con el ID
                    this.partidosData = this.partidosData.filter(partido => partido.id !== id);
                    console.log('Partidos después de la eliminación:', this.partidosData);
                    this.generarCalendario(); // Actualizamos el calendario con los partidos restantes
                } else {
                    console.error('No se encontró el partido con el ID proporcionado');
                }
            },
            error: (error) => {
                console.error('Error al obtener equipos:', error);
            }
        });
    }

    eliminarDeCalendario(partido: any) {
        // Aquí puedes eliminar el partido del calendario de acuerdo a tu lógica
        // Esto puede incluir filtrar la lista de partidos en tu componente o hacer otra acción
        console.log('Eliminando partido del calendario:', partido);
        // Lógica para actualizar el calendario
        this.cargarCalendarios(); // Recarga el calendario
    }

    private cargarEquipos() {
        this.teamService.getAllTeams().subscribe({
            next: (equipos) => {
                this.equiposData = equipos;
                console.log('Equipos cargados:', this.equiposData);
            },
            error: (error) => {
                console.error('Error al cargar equipos:', error);
            }
        });
    }

    // Mantener los métodos existentes
    cambiarMes(incremento: number) {
        this.fechaActual = new Date(
            this.fechaActual.getFullYear(),
            this.fechaActual.getMonth() + incremento,
            1
        );
        this.generarCalendario();
    }

    cambiarVista(event: Event) {
        const seleccion = (event.target as HTMLSelectElement).value;
        console.log(`Vista cambiada a: ${seleccion}`);
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



    categorias = [
        {id: 1, nombre: 'Primera'},
        {id: 2, nombre: 'Segunda'}
    ];

    torneos = [
        {id: 1, nombre: 'Torneo Apertura'},
        {id: 2, nombre: 'Torneo Clausura'}
    ];

    temporadas = [
        {id: 1, nombre: '2023/2024'},
        {id: 2, nombre: '2024/2025'}
    ];

    filtrarEquipos(event: Event): void {
        const idEquipo = (event.target as HTMLSelectElement).value;
        console.log('Filtrar equipos por:', idEquipo);
        this.equipoSeleccionado = idEquipo;

        // Filtramos los equipos según la selección
        if (idEquipo) {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo.id === parseInt(idEquipo, 10));
        } else {
            // Si no hay filtro, mostramos todos los equipos
            this.equiposFiltrados = this.equipos;
        }
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

    mostrarFormularioEdicion = false;
    partidoAEditar: any;

    editarPartido(partido: any) {
        this.partidoAEditar = partido;
        this.equipoLocalSeleccionado = partido.equipoLocal;
        this.equipoVisitanteSeleccionado = partido.equipoVisitante;
        this.fechaPartido = partido.fecha;
        this.marcadorLocal = partido.marcadorLocal;
        this.marcadorVisitante = partido.marcadorVisitante;
        this.mostrarFormularioEdicion = true;
    }

    guardarEdicion() {
        // Guardar los cambios del partido editado
        this.mostrarFormularioEdicion = false;
    }

    cancelarEdicion() {
        this.mostrarFormularioEdicion = false;
    }




}
