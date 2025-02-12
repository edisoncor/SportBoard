import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component'; // Importar BreadcrumbComponent
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
import { Match } from '../../models/real-time/match.model';
import { MatchService } from '../../services/real-time/match.service';
import { Season } from '../../models/real-time/season.model';
import { SeasonService } from '../../services/real-time/season.service';
import { TeamMatchStatistic } from '../../models/real-time/team-match-statistic.model';
import { Player } from '../../models/real-time/player.model';
import { PlayerService } from '../../services/real-time/player.service';
import { MatchStatistic } from '../../models/real-time/match-statistic.model';
import { MatchStatisticService } from '../../services/real-time/match-statistic.service';
import { PlayerMatchStatistic } from '../../models/real-time/player-match-statistic.model';
import { PlayerMatchStatisticService } from '../../services/real-time/player-match-statistic.service';
import {PlayerStatistic} from '../../models/real-time/player-statistic.model';
import { PlayerStatisticService } from '../../services/real-time/player-statistic.service';
import { PlayerStatisticDialogComponent } from './player-statistic-dialog/player-statistic-dialog.component';
import { Event } from '../../models/real-time/event.model';
import { EventService } from '../../services/real-time/event.service';

@Component({
  selector: 'app-details-match',
  imports: [CommonModule, MatDividerModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, SharedModule],  
  templateUrl: './details-match.component.html',
  styleUrl: './details-match.component.scss'
})


export class DetailsMatchComponent implements OnInit {
  breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Tiempo Real', url: '/tiempo-real' },
    { label: 'Detalles de Partido', url: '/catalogos' }
  ];

  match_id!: number;  // Se inicializa con "!" para indicar que se asignará después
  season_id!: number;
  selectedMatch!: Match;
  selectedSeason!: Season;
  matchStatistic!: MatchStatistic; //Agrupa las estadisticas del partido de ambos equipos
  playersHomeTeam: Player[] = []; // Revisar si es necesario el arreglo de jugadores
  playersAwayTeam: Player[] = [];
  playersHomeTeamStatistic: PlayerMatchStatistic[] = []; // Stats del partido para cada jugador
  playersAwayTeamStatistic: PlayerMatchStatistic[] = [];
  selectedPlayerStatistic!: PlayerStatistic;
  currentMatchEvents: Event[] = [];
  
  constructor(
      private route: ActivatedRoute,
      private matchService: MatchService,
      private matchStatisticService: MatchStatisticService,
      private playerService: PlayerService,
      private playerSeasonStatisticService: PlayerStatisticService,
      private seasonService: SeasonService,
      private playersMatchStatisticService: PlayerMatchStatisticService,
      private eventService: EventService,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const matchParam = params.get('matchId');  
      if (matchParam) {
        this.match_id = +matchParam;  // Convertir a número
        this.loadMatch();
      }
    });
  }

  loadMatch(): void {
    this.matchService.getMatch(this.match_id).subscribe(match => {
      this.selectedMatch = match;
      console.log('Selected Match:', this.selectedMatch); // Verificar los datos cargados
      if (this.selectedMatch.season_id !== undefined) {
        this.season_id = this.selectedMatch.season_id;
        this.loadSeason();
      }
      this.loadMatchStatistic();
      this.loadplayersHomeTeamStatistic();
      this.loadplayersAwayTeamStatistic();
      this.loadMatchEvents();
    });
  }

  loadSeason(): void {
    this.seasonService.getSeason(this.season_id).subscribe(season => {
      this.selectedSeason = season;
    });
  }

  loadplayersHomeTeamStatistic(): void {
    console.log('Home Team ID:', this.selectedMatch.home_team?.id); // Verificar el home_team_id
    this.playersMatchStatisticService.getPlayersMatchStatisticsByMatch(this.match_id, this.selectedMatch.home_team?.id).subscribe(playersMatchStatistic => {
      this.playersHomeTeamStatistic = playersMatchStatistic;
    });
  }

  loadplayersAwayTeamStatistic(): void {
    console.log('Away Team ID:', this.selectedMatch.away_team?.id); // Verificar el away_team_id
    this.playersMatchStatisticService.getPlayersMatchStatisticsByMatch(this.match_id, this.selectedMatch.away_team?.id).subscribe(playersMatchStatistic => {
      this.playersAwayTeamStatistic = playersMatchStatistic;
    });
  }

  loadMatchStatistic(): void {
    this.matchStatisticService.getMatchStatisticsByMatch(this.match_id).subscribe(matchStatistic => {
      this.matchStatistic = matchStatistic;
      //console.log('Match Statistic:', this.matchStatistic); // Verificar los datos cargados
    });
  }

  loadSelectedPlayerStatistic(player_id?: number): void {
    this.playerSeasonStatisticService.getPlayerStatisticsBySeason(this.season_id, player_id).subscribe(playerStatistic => {
      this.selectedPlayerStatistic = playerStatistic;
      this.viewPlayerSeasonStats();
    });
  }

  loadMatchEvents(): void {
    this.eventService.getEvents(this.match_id).subscribe(events => {
      this.currentMatchEvents = events;
    });
  }

  viewPlayerSeasonStats(): void {
    this.openDialog(this.selectedPlayerStatistic);
  }

  openDialog(playerStatistic: PlayerStatistic): void {
    const dialogRef = this.dialog.open(PlayerStatisticDialogComponent, {
      width: '350px',
      data: playerStatistic
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
      }
    });
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'Gol':
        return 'sports_soccer';
      case 'Falta':
        return 'report';
      case 'Tarjeta Amarilla':
        return 'warning';
      case 'Tarjeta Roja':
        return 'block';
      case 'Sustitución':
        return 'swap_horiz';
      default:
        return 'event';
    }
  }
}
