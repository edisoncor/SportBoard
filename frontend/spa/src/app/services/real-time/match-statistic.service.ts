import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchStatistic } from '../../models/real-time/match-statistic.model';

@Injectable({
    providedIn: 'root'
})

export class MatchStatisticService {
    private apiUrl = environment.services.realTime.endpoints.matchStats;

    constructor(private http: HttpClient) {}

    /*getMatchStatistics(): Observable<MatchStatistic[]> {
        return this.http.get<MatchStatistic[]>(this.apiUrl);
    }

    getMatchStatistic(id: number): Observable<MatchStatistic> {
        return this.http.get<MatchStatistic>(`${this.apiUrl}/${id}`);
    }

    createMatchStatistic(matchStatistic: MatchStatistic): Observable<MatchStatistic> {
        return this.http.post<MatchStatistic>(this.apiUrl, matchStatistic);
    }

    updateMatchStatistic(id: number, matchStatistic: MatchStatistic): Observable<MatchStatistic> {
        return this.http.put<MatchStatistic>(`${this.apiUrl}/${id}`, matchStatistic);
    }

    deleteMatchStatistic(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }*/

    getMatchStatisticsByMatch(match_id: number): Observable<MatchStatistic> {
        console.log(`${this.apiUrl}/${match_id}/stats`);
        return this.http.get<MatchStatistic>(`${this.apiUrl}/${match_id}/stats`);
    }
}