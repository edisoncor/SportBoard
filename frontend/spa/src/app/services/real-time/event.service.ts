import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event } from '../../models/real-time/event.model';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = environment.services.realTime.endpoints.events;

    constructor(private http: HttpClient) {}

    getEvents(match_id?:number): Observable<Event[]> {
        //return this.http.get<Event[]>('${this.apiUrl}?match_id=${match_id}');
        return this.http.get<Event[]>(`${this.apiUrl}?match_id=${match_id}`);
    }

    getEvent(id: number): Observable<Event> {
        return this.http.get<Event>(`${this.apiUrl}/${id}`);
    }

    createEvent(event: Event): Observable<Event> {
        return this.http.post<Event>(this.apiUrl, event);
    }

    updateEvent(id: number, event: Event): Observable<Event> {
        return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
    }

    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
