import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar/calendar.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-menu',
  standalone: true,  // Utiliza esta propiedad para no usar un módulo adicional
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule // Importa MatCardModule para usar tarjetas Material
  ],
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss'] // Asegúrate de que el nombre sea correcto
})
export class CardMenuComponent implements OnInit {

    models: any[] = [];
    helloMessage: string = '';
    constructor(private calendarService: CalendarService, private router: Router) {
    }
    ngOnInit(): void {
        this.calendarService.getHello().subscribe((data) => {
            console.log('Respuesta:', data);
            this.helloMessage = data;
        });

    }
    navigateToCalendar() {
        this.router.navigate(['/calendario/calendar']);
    }

    navigateToMatchtable() {
        this.router.navigate(['/calendario/matchtable']);
    }

    navigateToSorteo() {
        this.router.navigate(['/calendario/sorteo']);
    }


}
