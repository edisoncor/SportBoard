import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { TeamStatistic } from '../../models/real-time/team-statistic.model';
import { Team } from '../../models/real-time/team.model';
import { TeamStatisticService } from '../../services/real-time/team-statistic.service';

@Component({
  selector: 'app-competition-detail',
  imports: [CommonModule, MatDividerModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatNativeDateModule,
    SharedModule],
  templateUrl: './competition-detail.component.html',
  styleUrl: './competition-detail.component.scss',
  standalone: true,
})
export class CompetitionDetailComponent {
  breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Tiempo Real', url: '/tiempo-real' },
    { label: 'Detalles de Competencia', url: '/catalogos' }
  ];

  displayedColumns: string[] = ['#','Equipo','PJ','G','P','E','GF','GC','DG','PTS'];
  dataSource = new MatTableDataSource<TeamStatistic>();
  season_id!: number;  // Se inicializa con "!" para indicar que se asignará después

  constructor(
    private route: ActivatedRoute,
    private teamStatisticService: TeamStatisticService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const seasonParam = params.get('seasonId');  
      if (seasonParam) {
        this.season_id = +seasonParam;  // Convertir a número
        this.loadTeamStatistics();
      }
    });
  }

  loadTeamStatistics(): void {
    this.teamStatisticService.getSeasonTeamStatistics(this.season_id).subscribe(
      (teamStatistics) => {
        this.dataSource.data = teamStatistics;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
