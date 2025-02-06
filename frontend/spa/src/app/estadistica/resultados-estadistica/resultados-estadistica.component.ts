import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

@Component({
  selector: 'app-resultados-estadistica',
  templateUrl: './resultados-estadistica.component.html',
  styleUrls: ['./resultados-estadistica.component.scss'],
  standalone: false
})
export class ResultadosEstadisticaComponent implements OnInit {
  results: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.estadisticasService.getMatches().subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.results = response.data;
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
        console.log('Datos recibidos:', this.results);
      },
      error: (error) => {
        console.error('Error al obtener los partidos:', error);
        this.errorMessage = 'Error al cargar los partidos. Intente nuevamente más tarde.';
        this.isLoading = false;
        console.log('Error status:', error.status);
        console.log('Error headers:', error.headers);
      },
    });
  }
}