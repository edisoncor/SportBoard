import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasRoutingModule } from './estadistica-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Añadido
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { EncabezadoCompetenciaComponent } from './encabezado-competencia/encabezado-competencia.component';
import { CompetenciaEstadisticaComponent } from './competencia-estadistica/competencia-estadistica.component';
import { TabsEstadisticasComponent } from './tabs-estadisticas/tabs-estadisticas.component';
import { EquiposComponent } from './equipos/equipos.component';
import { PartidoProximosEstadisticaComponent } from './partido-proximos-estadistica/partido-proximos-estadistica.component';
import { EquiposEstadisticaComponent } from './equipos-estadistica/equipos-estadistica.component';
import { ResultadosEstadisticaComponent } from './resultados-estadistica/resultados-estadistica.component';
import { TablaPosicionesComponent } from './tabla-posiciones/tabla-posiciones.component';
import { JugadoresEstadisticaComponent } from './jugadores-estadistica/jugadores-estadistica.component';
import { CompetenciaInfoComponent } from './competencia-info/competencia-info.component';

import { EstadisticasService } from '../services/estadisticas/estadistica.service';


@NgModule({
  declarations: [
    CompetenciaInfoComponent,
    CompetenciaEstadisticaComponent,
    EncabezadoCompetenciaComponent,
    TabsEstadisticasComponent,
    EquiposComponent,
    PartidoProximosEstadisticaComponent,
    EquiposEstadisticaComponent,
    JugadoresEstadisticaComponent,
    ResultadosEstadisticaComponent,
    TablaPosicionesComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    EstadisticasRoutingModule,
    SharedModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatToolbarModule,
    MatTableModule,
    MatProgressSpinnerModule, 
  ],
  providers: [EstadisticasService]
})
export class EstadisticaModule {}