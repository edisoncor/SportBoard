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

    prueba: string = '';
    models: any[] = [];
    constructor(private calendarService: CalendarService, private router: Router) {
    }

    ngOnInit(): void {
        this.getHelloMessage();
    }

    getHelloMessage(): void {
        this.calendarService.getHello().subscribe(
            (response: string) => {
                this.prueba = response;  // Si la respuesta es "Hola", la asignamos al campo
            },
            (error) => {
                this.prueba = 'Error al obtener el mensaje';  // Si hay error, mostramos un mensaje de error
                console.error('Error al obtener el mensaje', error);
            }
        );
        this.models = [

    ];
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
