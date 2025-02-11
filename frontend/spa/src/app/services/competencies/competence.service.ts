import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Competence } from '../../models/competencies/competence.model';
@Injectable({
    providedIn: 'root'
})
export class CompetenceService {
    private apiUrl = `${environment.services.competencies.endpoints.competences}`;

    constructor(private http: HttpClient) {}

    getCompetences(): Observable<Competence[]> {
        return this.http.get<Competence[]>(this.apiUrl);
    }

    getCompetence(id: number): Observable<Competence> {
        return this.http.get<Competence>(`${this.apiUrl}${id}`);
    }

    createCompetence(competence: FormData): Observable<Competence> {
        return this.http.post<Competence>(this.apiUrl, competence);
    }

    updateCompetence(id: number, competence: FormData): Observable<Competence> {
        return this.http.put<Competence>(`${this.apiUrl}${id}/`, competence);
    }

    // Añadir método para actualización parcial
    partialUpdateCompetence(id: number, competence: FormData): Observable<Competence> {
        return this.http.patch<Competence>(`${this.apiUrl}${id}/`, competence);
    }

    deleteCompetence(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
