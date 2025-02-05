import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private baseUrl = 'http://localhost:9000/api/calendar';  // URL de tu backend

    constructor(private httpClient: HttpClient) { }



    // Método para obtener un saludo (prueba)
    getHello(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/hola`);
    }

    // Método para obtener Abel (prueba)
    getAbel(): Observable<string> {
        return this.httpClient.get(`${this.baseUrl}/abel`, { responseType: 'text' });
    }
}
