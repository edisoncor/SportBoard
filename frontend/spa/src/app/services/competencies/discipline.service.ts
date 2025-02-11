import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Discipline } from '../../models/competencies/discipline.model';

@Injectable({
    providedIn: 'root'
})
export class DisciplineService {
    private apiUrl = environment.services.competencies.endpoints.disciplines;

    constructor(private http: HttpClient) {}

    getDisciplines(): Observable<Discipline[]> {
        return this.http.get<Discipline[]>(this.apiUrl);
    }

    getDiscipline(id: number): Observable<Discipline> {
        return this.http.get<Discipline>(`${this.apiUrl}/${id}`);
    }

    createDiscipline(discipline: FormData): Observable<Discipline> {
        return this.http.post<Discipline>(this.apiUrl, discipline);
    }

    updateDiscipline(id: number, discipline: FormData): Observable<Discipline> {
        return this.http.put<Discipline>(`${this.apiUrl}${id}/`, discipline);
    }

    deleteDiscipline(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
