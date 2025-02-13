import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../services/calendar/team.service';
import { Team } from '../../models/calendar/team.model';
import { Match } from '../../models/calendar/match.model';
import { Location } from '@angular/common'; // Importar Location para navegar hacia atrás
import { Calendar } from '../../models/calendar/calendar.model';
import {SharedModule} from '../../shared/shared.module';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    mostrarFormulario: boolean = false;
    fechaActual: Date = new Date();
    nombreMesActual: string = '';
    anioActual: number = 0;
    diasCalendario: any[] = [];
    calendarios: Calendar[] = [];
    partidosData: Match[] = [];
    equipos: Team[] = [];
    equiposFiltrados: Team[] = [];  // Equipos filtrados
    equipoSeleccionado: string = '';  // Almacena el equipo seleccionado para el filtro
    fechaPartido: Date = new Date(); // Fecha y hora del partido
    equipoLocalSeleccionado: Team | null = null;
    equipoVisitanteSeleccionado: Team | null = null;
    homeScore: number = 0; // Marcador del equipo local
    marcadorVisitante: number = 0; // Marcador del equipo visitante
    diaSeleccionado: any = null;
    equiposData: Team[] = [];

    constructor(
        private router: Router,
        private teamService: TeamService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.cargarCalendarios();
        this.generarCalendario();
        this.teamService.getTeams().subscribe({
            next: (data) => {
                console.log('Equipos recibidos:', data);
                this.equipos = data;  // Asignar la lista de equipos a la propiedad 'equipos'
                this.equiposFiltrados = data;
                this.asignarEnfrentamientosAleatorios();  // Asignar enfrentamientos aleatorios
                this.generarCalendario();
            },
            error: (error) => {
                console.error('Error al obtener equipos:', error);
            }
        });
    }

    asignarEnfrentamientosAleatorios() {
        const equiposDisponibles = [...this.equipos]; // Copia para evitar modificar el original
        const partidos: Match[] = [];
        let idPartido = 1;

        const fechaBase = new Date(); // Tomamos la fecha actual como referencia
        let diasOffset = 0; // Para organizar partidos sin que se repitan en el mismo día

        while (equiposDisponibles.length >= 2) {
            // Selecciona dos equipos aleatorios
            const homeTeam = equiposDisponibles.splice(Math.floor(Math.random() * equiposDisponibles.length), 1)[0];
            const guestTeam = equiposDisponibles.splice(Math.floor(Math.random() * equiposDisponibles.length), 1)[0];

            // Generar una fecha de partido ordenada (días consecutivos)
            const fechaPartido = new Date(fechaBase);
            fechaPartido.setDate(fechaBase.getDate() + diasOffset);
            diasOffset += 2; // Espaciamos los partidos cada 2 días

            // Asignar hora de inicio aleatoria entre 14:00 y 20:00
            const horaInicio = Math.floor(Math.random() * 7) + 14; // Entre 14 y 20 horas
            const minutosInicio = Math.random() < 0.5 ? 0 : 30; // Minutos en 00 o 30
            const startTime = `${horaInicio.toString().padStart(2, '0')}:${minutosInicio.toString().padStart(2, '0')}`;

            // Duración estándar de 90 minutos
            const duration = 90;
            const finishTime = `${(horaInicio + Math.floor(duration / 60)).toString().padStart(2, '0')}:${(minutosInicio + (duration % 60)).toString().padStart(2, '0')}`;

            // Crear el partido
            const partido: Match = {
                id: idPartido++,
                date: fechaPartido,
                homeTeam: homeTeam,  // El equipo local
                guestTeam: guestTeam,  // El equipo visitante
                startTime: startTime,
                duration: duration,
                finishTime: finishTime,
                scoreboard: {
                    id: 0,
                    homeScore: 0,
                    guestScore: 0,
                    isFinished: false,
                    winner: null
                },
                playingField: {
                    id: 0,
                    name: `Estadio ${idPartido}`, // Nombre ficticio para el campo de juego
                    address: {
                        id: 0,
                        principalStreet: 'Calle Principal',
                        secondaryStreet: 'Calle Secundaria',
                        reference: 'Frente al parque'
                    }
                },
                status: 'PENDING'
            };

            partidos.push(partido);
        }

        // Asignamos los partidos al calendario
        this.partidosData = partidos;
        console.log('Partidos generados:', this.partidosData);

        // Actualizamos la vista del calendario
        this.generarCalendario();
    }


    mostrarPartidosDelDia(dia: any) {
        this.diaSeleccionado = dia;
        const partidosDelDia = this.partidosData.filter(partido => {
            const partidoFecha = new Date(partido.date);
            return partidoFecha.getDate() === dia &&
                partidoFecha.getMonth() === this.fechaActual.getMonth() &&
                partidoFecha.getFullYear() === this.fechaActual.getFullYear();
        });

        if (partidosDelDia.length > 0) {
            const partido = partidosDelDia[0];
            console.log(`Partido del ${dia}: ${partido.homeTeam.name} vs ${partido.guestTeam.name}`);
        }
    }

    filtrarEquiposLocal(event: any) {
        const equipoSeleccionado = event.target.value;
        this.equipoLocalSeleccionado = this.equipos.find(equipo => equipo.id === parseInt(equipoSeleccionado, 10)) || null;

        // Actualizar equipos disponibles para visitante
        if (this.equipoLocalSeleccionado) {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo.id !== this.equipoLocalSeleccionado!.id);
        } else {
            this.equiposFiltrados = [...this.equipos];
        }
    }

    filtrarEquiposVisitante(event: any) {
        const equipoSeleccionado = event.target.value;
        this.equipoVisitanteSeleccionado = this.equipos.find(equipo => equipo.id === parseInt(equipoSeleccionado, 10)) || null;
    }


    cerrarModalPartidos() {
        this.diaSeleccionado = null;
    }

    private cargarCalendarios() {
        this.teamService.getAllCalendars().subscribe({
            next: (calendarios) => {
                console.log('Calendarios raw:', calendarios);

                this.partidosData = calendarios.map(calendario => {
                    const partidoData = typeof calendario === 'string' ? JSON.parse(calendario) : calendario;

                    const fecha = new Date(partidoData.date);
                    console.log('Fecha procesada:', fecha);

                    return {
                        id: partidoData.id,
                        date: fecha,
                        homeTeam: partidoData.homeTeam,
                        guestTeam: partidoData.guestTeam,
                        startTime: partidoData.startTime,
                        duration: partidoData.duration,
                        finishTime: partidoData.finishTime,
                        scoreboard: partidoData.scoreboard,
                        playingField: partidoData.playingField,
                        status: partidoData.status
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

    actualizarEquiposDisponibles() {
        if (this.equipoLocalSeleccionado) {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo.id !== this.equipoLocalSeleccionado!.id);
        } else {
            this.equiposFiltrados = [...this.equipos];
        }

        if (this.equipoVisitanteSeleccionado) {
            this.equiposFiltrados = this.equiposFiltrados.filter(equipo => equipo.id !== this.equipoVisitanteSeleccionado!.id);
        }
    }

    crearPartido() {
        // Verificar que ambos equipos y la fecha sean válidos
        if (!this.equipoLocalSeleccionado?.name || !this.equipoVisitanteSeleccionado?.name || !this.fechaPartido) {
            console.error("Debe seleccionar ambos equipos y la fecha.");
            return;
        }

        // Convertir la fecha seleccionada a un objeto Date
        const fechaPartidoDate = new Date(this.fechaPartido);

        // Validar que la fecha seleccionada sea válida
        if (isNaN(fechaPartidoDate.getTime())) {
            console.error("La fecha seleccionada no es válida.");
            return;
        }

        // Crear el objeto partido con la información proporcionada
        const partido: Match = {
            id: this.partidosData.length + 1,
            date: fechaPartidoDate,  // Usamos la fecha proporcionada directamente
            homeTeam: this.equipoLocalSeleccionado,
            guestTeam: this.equipoVisitanteSeleccionado,
            startTime: '',  // Aquí puedes completar con un valor adecuado
            duration: 90,  // Duración estándar
            finishTime: '', // Similar a startTime, ajusta si es necesario
            scoreboard: {
                id: 0,
                homeScore: this.homeScore,
                guestScore: this.marcadorVisitante,
                isFinished: false,
                winner: null
            },
            playingField: {
                id: 0,
                name: 'Estadio Ejemplo',
                address: {
                    id: 0,
                    principalStreet: 'Calle Ejemplo',
                    secondaryStreet: 'Calle Secundaria',
                    reference: 'Frente al parque'
                }
            },
            status: 'PENDING'
        };

        // Verificar que diaSeleccionado tiene los partidos y agregar el nuevo
        const diaPartido = this.diaSeleccionado;
        if (!diaPartido.partidos) {
            diaPartido.partidos = [];  // Inicializar la lista de partidos si no existe
        }
        diaPartido.partidos.push(partido);

        // Actualizar el calendario con el nuevo partido
        this.teamService.createMatch(partido).subscribe({
            next: (calendario) => {
                console.log('Calendario actualizado:', calendario);
                this.cargarCalendarios();  // Recargar el calendario para reflejar el cambio
            },
            error: (error) => {
                console.error('Error al crear el partido en el calendario:', error);
            }
        });

        // Cerrar el formulario después de guardar
        this.mostrarFormulario = false;
    }


    generarCalendario() {
        const primerDiaDelMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
        const ultimoDiaDelMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0);

        this.nombreMesActual = primerDiaDelMes.toLocaleString('default', { month: 'long' });
        this.anioActual = primerDiaDelMes.getFullYear();

        const diaSemanaInicio = primerDiaDelMes.getDay();
        const semanas: any[] = [];
        let semanaActual: any[] = [];

        for (let i = 0; i < diaSemanaInicio; i++) {
            semanaActual.push({ fecha: '', esmesMesActual: false, partidos: [] });
        }

        for (let dia = 1; dia <= ultimoDiaDelMes.getDate(); dia++) {
            const diaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), dia);

            const partidosDia = this.partidosData.filter(partido => {
                const partidoFecha = new Date(partido.date);
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

        if (semanaActual.length > 0) {
            while (semanaActual.length < 7) {
                semanaActual.push({ fecha: '', esmesMesActual: false, partidos: [] });
            }
            semanas.push(semanaActual);
        }

        this.diasCalendario = semanas;
        console.log('Calendario generado:', this.diasCalendario);
    }

    formatearFecha(fecha: any): string {
        const fechaDate = new Date(fecha);

        if (isNaN(fechaDate.getTime())) {
            console.error("La fecha es inválida:", fecha);
            return "";
        }

        const year = fechaDate.getFullYear();
        const month = ('0' + (fechaDate.getMonth() + 1)).slice(-2);
        const day = ('0' + fechaDate.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    eliminarPartido(id: number) {
        this.teamService.getTeams().subscribe({
            next: (equipos) => {
                console.log('Equipos obtenidos:', equipos);
                const partidoAEliminar = this.partidosData.find(partido => partido.id === id);

                if (partidoAEliminar) {
                    console.log('Partido a eliminar:', partidoAEliminar);
                    this.partidosData = this.partidosData.filter(partido => partido.id !== id);
                    console.log('Partidos después de la eliminación:', this.partidosData);
                    this.generarCalendario();
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
        console.log('Eliminando partido del calendario:', partido);
        this.cargarCalendarios();
    }

    private cargarEquipos() {
        this.teamService.getTeams().subscribe({
            next: (equipos) => {
                this.equiposData = equipos;
                console.log('Equipos cargados:', this.equiposData);
            },
            error: (error) => {
                console.error('Error al cargar equipos:', error);
            }
        });
    }

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

    filtrarEquipos(event: Event): void {
        const idEquipo = (event.target as HTMLSelectElement).value;
        console.log('Filtrar equipos por:', idEquipo);
        this.equipoSeleccionado = idEquipo;

        if (idEquipo) {
            this.equiposFiltrados = this.equipos.filter(equipo => equipo.id === parseInt(idEquipo, 10));
        } else {
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
        // Asignamos el partido que se está editando
        this.partidoAEditar = partido;

        // Asignamos los equipos seleccionados del partido a las variables locales
        this.equipoLocalSeleccionado = partido.homeTeam;  // Aquí usamos todo el objeto equipo, no solo el nombre
        this.equipoVisitanteSeleccionado = partido.guestTeam;  // Lo mismo para el equipo visitante

        // Asignamos los detalles del partido (fecha y marcador)
        this.fechaPartido = partido.date;
        this.homeScore = partido.scoreboard.homeScore;
        this.marcadorVisitante = partido.scoreboard.guestScore;

        // Indicamos que el formulario de edición debe mostrarse
        this.mostrarFormularioEdicion = true;
    }


    guardarEdicion() {
        this.mostrarFormularioEdicion = false;
    }

    cancelarEdicion() {
        this.mostrarFormularioEdicion = false;
    }
    volver() {
        this.location.back(); // Esto te lleva a la vista anterior
    }
}
