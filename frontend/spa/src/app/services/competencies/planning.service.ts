import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Planning } from '../../models/competencies/planning.model';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    private apiUrl = environment.services.competencies.endpoints.plannings;

    constructor(private http: HttpClient) {}

    getPlannings(): Observable<Planning[]> {
        return this.http.get<Planning[]>(this.apiUrl);
    }

    getPlanning(id: number): Observable<Planning> {
        return this.http.get<Planning>(`${this.apiUrl}/${id}`);
    }

    createPlanning(planning: Planning): Observable<Planning> {
        return this.http.post<Planning>(this.apiUrl, planning);
    }

    updatePlanning(id: number, planning: Planning): Observable<Planning> {
        return this.http.put<Planning>(`${this.apiUrl}/${id}`, planning);
    }

    deletePlanning(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
