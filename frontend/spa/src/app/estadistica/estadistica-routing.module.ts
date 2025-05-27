import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadosEstadisticaComponent } from './resultados-estadistica/resultados-estadistica.component';
import { TablaPosicionesComponent } from './tabla-posiciones/tabla-posiciones.component';
import { JugadoresEstadisticaComponent } from './jugadores-estadistica/jugadores-estadistica.component';
import { EquiposEstadisticaComponent } from './equipos-estadistica/equipos-estadistica.component';
import { CompetenciaEstadisticaComponent } from './competencia-estadistica/competencia-estadistica.component';
import { CompetenciaInfoComponent } from './competencia-info/competencia-info.component';

const routes: Routes = [
  {
    path: '', component: CompetenciaEstadisticaComponent,
    children: [
      {path: '', redirectTo: 'competencia-info', pathMatch:'full'},
      {path: 'competencia-info', component: CompetenciaInfoComponent},
      { path: 'resultado-estadistica', component: ResultadosEstadisticaComponent },
      { path: 'tabla-posiciones', component: TablaPosicionesComponent },
      { path: 'jugadores-estadisticas', component: JugadoresEstadisticaComponent },
      { path: 'equipos-estadisticas', component: EquiposEstadisticaComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule { }