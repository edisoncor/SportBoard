import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

@Component({
  selector: 'app-partido-proximos-estadistica',
  templateUrl: './partido-proximos-estadistica.component.html',
  styleUrls: ['./partido-proximos-estadistica.component.scss'],
  standalone: false
})
export class PartidoProximosEstadisticaComponent implements OnInit {
  matches: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadUpcomingMatches();
  }

  loadUpcomingMatches(): void {
    this.estadisticasService.getUpcomingMatches().subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.matches = response.data;
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
        console.log('Partidos próximos recibidos:', this.matches);
      },
      error: (error) => {
        console.error('Error al obtener los partidos próximos:', error);
        this.errorMessage = 'Error al cargar los partidos próximos. Intente nuevamente más tarde.';
        this.isLoading = false;
        console.log('Error status:', error.status);
        console.log('Error headers:', error.headers);
      }
    });
  }
}