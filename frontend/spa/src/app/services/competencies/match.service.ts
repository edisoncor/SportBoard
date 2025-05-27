import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Match } from '../../models/competencies/match.model';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private apiUrl = environment.services.competencies.endpoints.matches;

    constructor(private http: HttpClient) {}

    getMatches(): Observable<Match[]> {
        return this.http.get<Match[]>(this.apiUrl);
    }

    getMatch(id: number): Observable<Match> {
        return this.http.get<Match>(`${this.apiUrl}/${id}`);
    }

    createMatch(match: Match): Observable<Match> {
        return this.http.post<Match>(this.apiUrl, match);
    }

    updateMatch(id: number, match: Match): Observable<Match> {
        return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
    }

    deleteMatch(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
