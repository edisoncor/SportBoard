import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentCalendar } from '../../../environments/environmentCalendar';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    private helloUrl = environmentCalendar.services.calendar.endpoints.hello;
    constructor(private httpClient: HttpClient) { }

    getHello(): Observable<string> {
        return this.httpClient.get(this.helloUrl , {
            responseType: 'text',
            headers: new HttpHeaders({
                'Accept': 'text/plain'
            })
        });
    }

}
