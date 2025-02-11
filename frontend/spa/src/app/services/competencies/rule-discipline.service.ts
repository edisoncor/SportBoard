import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RuleDiscipline } from '../../models/competencies/rule-discipline.model';

@Injectable({
    providedIn: 'root'
})
export class RuleDisciplineService {
    private apiUrl = environment.services.competencies.endpoints.ruleDisciplines;

    constructor(private http: HttpClient) {}

    getRuleDisciplines(): Observable<RuleDiscipline[]> {
        return this.http.get<RuleDiscipline[]>(this.apiUrl);
    }

    getRuleDiscipline(id: number): Observable<RuleDiscipline> {
        return this.http.get<RuleDiscipline>(`${this.apiUrl}${id}/`);
    }

    createRuleDiscipline(ruleDiscipline: RuleDiscipline): Observable<RuleDiscipline> {
        return this.http.post<RuleDiscipline>(this.apiUrl, ruleDiscipline);
    }

    updateRuleDiscipline(id: number, ruleDiscipline: RuleDiscipline): Observable<RuleDiscipline> {
        return this.http.put<RuleDiscipline>(`${this.apiUrl}${id}/`, ruleDiscipline);
    }

    deleteRuleDiscipline(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
