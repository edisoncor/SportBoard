import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';


@Component({
    selector: 'app-tr-estadistica',
    imports: [MatCardModule, MatTabsModule, MatTableModule],
    templateUrl: './tr-estadistica.component.html',
    styleUrl: './tr-estadistica.component.scss'
})
export class TrEstadisticaComponent {

}
