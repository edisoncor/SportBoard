import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

@Component({
  selector: 'app-tabla-posiciones',
  templateUrl: './tabla-posiciones.component.html',
  styleUrls: ['./tabla-posiciones.component.scss'],
  standalone    : false
})
export class TablaPosicionesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'team', 'played', 'won', 'drawn', 'lost', 'lastMatches', 'points'];
  dataSource: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadStandings();
  }

  loadStandings(): void {
    this.estadisticasService.getLeaderboards().subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.dataSource = response.data.map((team: any, index: number) => ({
            ...team,
            position: index + 1 // Añadir posición si no viene en los datos
          }));
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener la tabla de posiciones:', error);
        this.errorMessage = 'Error al cargar la tabla de posiciones. Intente nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }

  getLastMatchesIcons(lastMatches: string[]): string[] {
    return lastMatches.map(match => {
      switch (match) {
        case 'W': return 'check_circle';
        case 'D': return 'remove_circle';
        case 'L': return 'cancel';
        default: return 'help_outline';
      }
    });
  }
}