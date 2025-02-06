import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

type PlayerStat = 'goals' | 'assists' | 'yellowCards' | 'redCards';

interface PlayerStats {
  id: number;
  name: string;
  team: string;
  teamLogo: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

@Component({
  selector: 'app-jugadores-estadistica',
  templateUrl: './jugadores-estadistica.component.html',
  standalone: false,
  styleUrls: ['./jugadores-estadistica.component.scss']
})
export class JugadoresEstadisticaComponent implements OnInit {
  playerStats: PlayerStats[] = [];
  filteredStats: PlayerStats[] = [];
  currentStats: string[] = ['all'];
  displayedColumns: string[] = ['position', 'name', 'team', 'goals', 'assists', 'yellowCards', 'redCards'];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadPlayerStats();
  }

  loadPlayerStats(): void {
    this.estadisticasService.getPlayers().subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.playerStats = response.data;
          this.filteredStats = this.playerStats;
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener las estadísticas de jugadores:', error);
        this.errorMessage = 'Error al cargar las estadísticas de jugadores. Intente nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }

  filterStats(stat: string) {
    if (stat === 'all') {
      this.currentStats = ['all'];
      this.filteredStats = this.playerStats;
      this.displayedColumns = ['position', 'name', 'team', 'goals', 'assists', 'yellowCards', 'redCards'];
    } else {
      const index = this.currentStats.indexOf(stat);
      if (index > -1) {
        this.currentStats.splice(index, 1);
      } else {
        this.currentStats.push(stat);
      }

      if (this.currentStats.length === 0) {
        this.currentStats = ['all'];
        this.filteredStats = this.playerStats;
        this.displayedColumns = ['position', 'name', 'team', 'goals', 'assists', 'yellowCards', 'redCards'];
      } else {
        this.currentStats = this.currentStats.filter(s => s !== 'all');
        this.filteredStats = this.playerStats.filter(player =>
          this.currentStats.some(stat => player[stat as PlayerStat] > 0)
        );
        this.displayedColumns = ['position', 'name', 'team', ...this.currentStats];
      }
    }
  }
}