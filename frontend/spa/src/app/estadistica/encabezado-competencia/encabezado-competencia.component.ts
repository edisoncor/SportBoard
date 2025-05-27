import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';
import { flush } from '@angular/core/testing';

interface Competition {
  _id: string;
  id: number;
  name: string;
  logo: string;
  season: string;
}

@Component({
  selector: 'app-encabezado-competencia',
  templateUrl: './encabezado-competencia.component.html',
  styleUrls: ['./encabezado-competencia.component.scss'],
  standalone: false
})
export class EncabezadoCompetenciaComponent implements OnInit {
  isLoading: boolean = true;
  errorMessage: string | null = null;
  competition: Competition | null = null;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.loadCompetition();
  }

  loadCompetition(): void {
    this.estadisticasService.getCompetition().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.competition = response.data;
        } else {
          this.errorMessage = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los datos de la competición:', error);
        this.errorMessage = 'Error al cargar los datos de la competición';
        this.isLoading = false;
      }
    });
  }
}

