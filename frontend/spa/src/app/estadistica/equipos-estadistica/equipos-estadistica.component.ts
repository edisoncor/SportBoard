import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

type TeamStat = 'goalsFor' | 'goalsAgainst' | 'goalDifference' | 'points' | 
                'possession' | 'shotsOnTarget' | 'passesCompleted' | 
                'yellowCards' | 'redCards';

interface TeamStats {
  team: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  possession: number;
  shotsOnTarget: number;
  passesCompleted: number;
  yellowCards: number;
  redCards: number;
}

@Component({
  selector: 'app-equipos-estadistica',
  templateUrl: './equipos-estadistica.component.html',
  styleUrls: ['./equipos-estadistica.component.scss'],
  standalone: false
})
export class EquiposEstadisticaComponent implements OnInit {
  teamStats: TeamStats[] = [];
  filteredStats: TeamStats[] = [];
  currentStats: string[] = ['all'];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  displayedColumns: string[] = [
    'team', 'played', 'won', 'drawn', 'lost', 'goalsFor', 
    'goalsAgainst', 'goalDifference', 'points', 'possession', 
    'shotsOnTarget', 'passesCompleted', 'yellowCards', 'redCards'
  ];

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadTeamStats();
  }

  loadTeamStats(): void {
    this.isLoading = true;
    this.estadisticasService.getTeams().subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.teamStats = response.data;
          this.filteredStats = this.teamStats;
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error al obtener las estadísticas de equipos:', error);
        this.errorMessage = 'Error al cargar las estadísticas. Intente nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }

  filterStats(stat: string) {
    if (stat === 'all') {
      this.currentStats = ['all'];
      this.filteredStats = this.teamStats;
      this.displayedColumns = [
        'team', 'played', 'won', 'drawn', 'lost', 'goalsFor', 
        'goalsAgainst', 'goalDifference', 'points', 'possession', 
        'shotsOnTarget', 'passesCompleted', 'yellowCards', 'redCards'
      ];
    } else {
      const index = this.currentStats.indexOf(stat);
      if (index > -1) {
        this.currentStats.splice(index, 1);
      } else {
        this.currentStats.push(stat);
      }

      if (this.currentStats.length === 0) {
        this.currentStats = ['all'];
        this.filteredStats = this.teamStats;
        this.displayedColumns = [
          'team', 'played', 'won', 'drawn', 'lost', 'goalsFor', 
          'goalsAgainst', 'goalDifference', 'points', 'possession', 
          'shotsOnTarget', 'passesCompleted', 'yellowCards', 'redCards'
        ];
      } else {
        this.currentStats = this.currentStats.filter(s => s !== 'all');
        this.filteredStats = this.teamStats.filter(team =>
          this.currentStats.some(stat => Number(team[stat as TeamStat]) > 0)
        );
        this.displayedColumns = ['team', 'played', 'won', 'drawn', 'lost', ...this.currentStats];
      }
    }
  }
}

