import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CronologiaComponent } from '../cronologia/cronologia.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core'; //No está en el modulo shared
import { MatchService } from '../../services/real-time/match.service';
import { Match, MatchesByDayResponse } from '../../models/real-time/match.model';
import { Season } from '../../models/real-time/season.model'; // Importar el modelo Season
import { Competition } from '../../models/real-time/competition.model';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
    selector: 'app-selec-partido',
    imports: [CommonModule, MatDividerModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatNativeDateModule,
      SharedModule],
    templateUrl: './selec-partido.component.html',
    styleUrl: './selec-partido.component.scss',
    standalone: true,
})
export class SelecPartidoComponent implements OnInit {
  breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Tiempo Real', url: '/tiempo-real' }
  ];
  competencias = [
    { nombre: 'Champions League' },
    { nombre: 'Mundial de Clubes' },
    { nombre: 'La Liga' },
    { nombre: 'Premier League' },
    { nombre: 'Ligue 1' },
  ];
  //selectedDate: string = new Date().toISOString().split('T')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$3-$2'); // Fecha actual en formato YYYY-DD-MM
  //Fecha en el formato YYYY-MM-DD:
  selectedDate: string = new Date().toISOString().split('T')[0];
  currentDate: string = new Date().toISOString().split('T')[0];
  status: string[] = [];
  esArbitro = true;
  matchesByDay: MatchesByDayResponse[] = [];
  matchesByDayFiltered: MatchesByDayResponse[] = [];
  allMatches: MatchesByDayResponse[] = []
  playingMatches: MatchesByDayResponse[] = []
  finishedMatches: MatchesByDayResponse[] = []
  toBePlayedMatches: MatchesByDayResponse[] = []
  partidos: Match[] = [];
  temporadas: { competition: Competition, season: Season, 
  matches: Match[] }[] = []; // Agregar propiedad para almacenar temporadas y sus partidos

  // Propiedad para controlar la visibilidad de los partidos por competencia
  hiddenCompetitions: { [key: string]: boolean } = {};

  constructor(private matchService: MatchService, private dialog: MatDialog, 
    private router: Router) {}
  
  ngOnInit() {
    //this.getMatchesByDay(this.defaultDate);
    //this.getPartidos();
    this.fetchMatches();
    this.getPlayingMatches();
    this.getFilteredMatches();
  }
  
  agregarCompetencia() {
    const nuevaCompetencia = { nombre: 'Nueva Competencia' };
    this.competencias.push(nuevaCompetencia);
  }

  quitarCompetencia(competencia: { nombre: string }) {
    this.competencias = this.competencias.filter(c => c !== competencia);
  }

  toggleCompetitionVisibility(competitionName: string) {
    this.hiddenCompetitions[competitionName] = !this.hiddenCompetitions[competitionName];
  }

  isCompetitionHidden(competitionName: string): boolean {
    return this.hiddenCompetitions[competitionName];
  }

  getPartidos() {
    this.matchService.getMatches().subscribe(data => {
      this.partidos = data;
    });
  }
  /*
  getMatchesByDay(date: Date) {
    this.matchService.getMatchesByDay(date.toISOString().split('T')[0]).subscribe(data => {
        this.temporadas = data
            .filter(item => item.season !== undefined)
            .map(item => ({
                competition: item.competition as Competition,
                season: item.season as Season,
                matches: item.matches as Match[]
            }));
    });
  }*/

  // Devuelve todos los partidos de determinado día
  fetchMatches(): void {
    console.log('Fecha seleccionada:', this.selectedDate);
    this.matchService.getMatchesByDay(this.selectedDate).subscribe({
        next: (data) => {
            this.matchesByDay = data;
            //console.log('Partidos obtenidos:', this.matchesByDay);
        },
        error: (error) => {
            console.error('Error al obtener los partidos', error);
        }
    });
  }

  // Devuelve solo los partidos en vivo o 'PLAYING' de la fecha de hoy
  getPlayingMatches(): void {
    //this.playingMatches = this.matchesByDay.filter(match => match.matches.some(m => m.status === 'TO_BE_PLAYED'));
    this.matchService.getMatchesByDayFiltered(this.currentDate, ['PLAYING']).subscribe({
      next: (data) => {
          this.playingMatches = data;
          //console.log('Partidos en vivo:', this.matchesByDayFiltered);
      },
      error: (error) => {
          console.error('Error al obtener los partidos en vivo', error);
      }
  });
  }

  // Asigna a finishedMatches los partidos finalizados y a toBePlayedMatches los que se jugarán de la fecha seleccionsada
  getFilteredMatches(): void {
    // Se actualiza la lista de todos los partidos del dia
    this.fetchMatches();
    // Partidos finalizados de la fecha seleccionada
    //this.finishedMatches = this.matchesByDay.filter(match => match.matches.some(m => m.status == 'Finalizado'));
    this.matchService.getMatchesByDayFiltered(this.selectedDate, ['FINISHED']).subscribe({
      next: (data) => {
        this.finishedMatches = data;
        //console.log('Partidos finalizados:', this.matchesByDayFiltered);
      },
      error: (error) => {
        console.error('Error al obtener los partidos finalizados', error);
      }
    });
    // Partidos por jugarse de la fecha seleccionada
    //this.toBePlayedMatches = this.matchesByDay.filter(match => match.matches.some(m => m.status == 'Por jugarse'));
    this.matchService.getMatchesByDayFiltered(this.selectedDate, ['TO_BE_PLAYED']).subscribe({
      next: (data) => {
        this.toBePlayedMatches = data;
      },
      error: (error) => {
        console.error('Error al obtener los partidos por jugarse', error);
      }
    });
  }

  // Método general que recibe una fecha y uno o varios estados de partido para filtrar los partidos
  fetchMatchesFilter(): void {
    this.matchService.getMatchesByDayFiltered(this.selectedDate, this.status).subscribe({
        next: (data) => {
            this.matchesByDayFiltered = data;
        },
        error: (error) => {
            console.error('Error al obtener los partidos', error);
        }
    });
  }

  previousDay() {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.getFilteredMatches();
  }
  
  nextDay() {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.getFilteredMatches();
  }

  navigateToCompetitionDetail(seasonId: number) {
    this.router.navigate(['/tiempo-real/competition-detail', seasonId]);
  }

  /*navigateToDetailsMatch() {
    this.router.navigate(['/tiempo-real/details-match']);
  }*/

  navigateToDetailsMatch(matchId: number) {
    this.router.navigate(['/tiempo-real/details-match', matchId]);
  }
  
  navigateToCronologia(partidoId: number) {
    this.router.navigate(['/tiempo-real/cronologia', partidoId]); 
  }

  navigateToArbitro() {
    this.router.navigate(['/tiempo-real/arbitro']); 
  }

  navigateToTrEstadistica() {
    this.router.navigate(['/tiempo-real/estadistica']);
  }

  displayedColumns: string[] = ['equipoLocal', 'equipoVisitante', 'fecha'];
  //displayedColumns: string[] = ['equipos', 'fecha', 'accion'];
  /*dataSource = [
    { equipos: 'Quinto - Sexto', marcador: '0 - 1', tiempo: 1, estado: 'En juego' },
    { equipos: 'Equipo B', marcador: '0 - 0', tiempo: 2, estado: 'Suspendido' },
  ];*/
  }
