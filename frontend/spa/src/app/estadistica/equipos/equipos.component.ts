import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
  standalone: false
})
export class EquiposComponent implements OnInit {
  teams: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.estadisticasService.getTeams().subscribe({
      next: (response: any) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.teams = response.data;
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
        console.log('Equipos recibidos:', this.teams);
      },
      error: (error) => {
        console.error('Error al obtener los equipos:', error);
        this.errorMessage = 'Error al cargar los equipos. Intente nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }
}