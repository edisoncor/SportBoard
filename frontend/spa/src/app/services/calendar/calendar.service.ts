import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private baseUrl = 'http://localhost:9000/api/calendar';

    constructor(private httpClient: HttpClient) { }



    getHello(): Observable<string> {
        return this.httpClient.get(this.baseUrl + '/hola', {
            responseType: 'text',
            headers: new HttpHeaders({
                'Accept': 'text/plain'
            })
        });
    }

    // Método para obtener Abel (prueba)
    getAbel(): Observable<string> {
        return this.httpClient.get(`${this.baseUrl}/abel`, { responseType: 'text' });
    }
}
