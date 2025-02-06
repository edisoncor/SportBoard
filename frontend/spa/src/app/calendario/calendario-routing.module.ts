import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SorteoComponent } from './sorteo/sorteo.component'; // Componente de sorteo
import { CalendarComponent } from './calendar/calendar.component';
import { MatchtableComponent } from './matchtable/matchtable.component';
import {CardMenuComponent} from './card-menu/card-menu.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'card-menu',
    pathMatch: 'full'
  },
    {
      path: 'calendar',
        component: CalendarComponent
    },
  {
    path: 'sorteo',
    component: SorteoComponent
  },
  {
    path: 'matchtable',
    component: MatchtableComponent
  },
  {
    path: 'card-menu',
    component: CardMenuComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule { }
