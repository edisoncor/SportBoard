import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompetitionEdition } from '../../models/competencies/competence-edition.model';
import { CompetitionEditionPayload } from '../../models/competencies/edition-payload.model';

@Injectable({
    providedIn: 'root'
})
export class CompetenceEditionService {
    private apiUrl = environment.services.competencies.endpoints.competenceEditions;

    constructor(private http: HttpClient) {}

    getCompetenceEditions(): Observable<CompetitionEdition[]> {
        return this.http.get<CompetitionEdition[]>(this.apiUrl);
    }

    getCompetenceEdition(id: number): Observable<CompetitionEdition> {
        return this.http.get<CompetitionEdition>(`${this.apiUrl}${id}/`);
    }

    createCompetenceEdition(editionData: CompetitionEditionPayload): Observable<CompetitionEdition> {
        return this.http.post<CompetitionEdition>(this.apiUrl, editionData);
    }

    updateCompetenceEdition(id: number, editionData: CompetitionEditionPayload): Observable<CompetitionEdition> {
        return this.http.put<CompetitionEdition>(`${this.apiUrl}${id}/`, editionData);
    }

    deleteCompetenceEdition(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
