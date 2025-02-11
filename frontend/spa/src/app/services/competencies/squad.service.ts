import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Squad } from '../../models/competencies/squad.model';

@Injectable({
    providedIn: 'root'
})
export class SquadService {
    private apiUrl = environment.services.competencies.endpoints.squads;

    constructor(private http: HttpClient) {}

    getSquads(): Observable<Squad[]> {
        return this.http.get<Squad[]>(this.apiUrl);
    }

    getSquad(id: number): Observable<Squad> {
        return this.http.get<Squad>(`${this.apiUrl}${id}/`);
    }

    createSquad(squadData: any): Observable<Squad> {
        return this.http.post<Squad>(this.apiUrl, squadData);
    }

    updateSquad(id: number, squadData: any): Observable<Squad> {
        return this.http.put<Squad>(`${this.apiUrl}${id}/`, squadData);
    }

    deleteSquad(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
