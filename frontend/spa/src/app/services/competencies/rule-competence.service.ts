import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RuleCompetition } from '../../models/competencies/rule-competence.model';

@Injectable({
    providedIn: 'root'
})
export class RuleCompetenceService {
    private apiUrl = environment.services.competencies.endpoints.ruleCompetences;

    constructor(private http: HttpClient) {}

    getRuleCompetences(): Observable<RuleCompetition[]> {
        return this.http.get<RuleCompetition[]>(this.apiUrl);
    }

    getRuleCompetence(id: number): Observable<RuleCompetition> {
        return this.http.get<RuleCompetition>(`${this.apiUrl}${id}/`);
    }

    createRuleCompetence(ruleCompetence: RuleCompetition): Observable<RuleCompetition> {
        return this.http.post<RuleCompetition>(this.apiUrl, ruleCompetence);
    }

    updateRuleCompetence(id: number, ruleCompetence: RuleCompetition): Observable<RuleCompetition> {
        return this.http.put<RuleCompetition>(`${this.apiUrl}${id}/`, ruleCompetence);
    }

    deleteRuleCompetence(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
