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
import {MatDividerModule} from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-selec-partido',
    imports: [CommonModule, MatDividerModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule],
    templateUrl: './selec-partido.component.html',
    styleUrl: './selec-partido.component.scss'
})
export class SelecPartidoComponent implements OnInit {
  currentDate = new Date();
  esArbitro = true;
  partidos: any[] = [];

  constructor(private router: Router, private http: HttpClient) { 
  }

  ngOnInit() {
    this.getPartidos();
  }

  getPartidos() {
    this.http.get('/api/partidos').subscribe((data: any) => {
      this.partidos = data.data; // Asignar los datos de los partidos
    });
  }

  navigateToCronologia(partidoId: number) {
    this.router.navigate(['/tiempo-real/cronologia', partidoId]); 
  }

  navigateToArbitro() {
    this.router.navigate(['/tiempo-real/arbitro']); 
  }
  

    displayedColumns: string[] = ['equipos', 'fecha', 'accion'];
    dataSource = [
      { equipos: 'Quinto - Sexto', marcador: '0 - 1', tiempo: 1, estado: 'En juego' },
      { equipos: 'Equipo B', marcador: '0 - 0', tiempo: 2, estado: 'Suspendido' },
    ];
  }
