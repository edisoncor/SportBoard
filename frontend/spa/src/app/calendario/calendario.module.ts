import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarioRoutingModule } from './calendario-routing.module';
import { MatchtableComponent } from './matchtable/matchtable.component';
import {SorteoComponent} from './sorteo/sorteo.component';
import {CardMenuComponent} from './card-menu/card-menu.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CalendarioRoutingModule,
      CardMenuComponent,
    CalendarComponent,
    MatchtableComponent,
    SorteoComponent
  ],
  exports: []
})
export class CalendarioModule { }
