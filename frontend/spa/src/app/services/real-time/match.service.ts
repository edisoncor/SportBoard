import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Match } from '../../models/real-time/match.model';
import { MatchesByDayResponse } from '../../models/real-time/match.model';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private apiUrl = environment.services.realTime.endpoints.matches;
    private matchesbdUrl = environment.services.realTime.endpoints.matchesByDay;
    private matchesByDayFilteredUrl = environment.services.realTime.endpoints.matchesFilter;

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

    getMatchesByDate(date: string): Observable<Match[]> {
        return this.http.get<Match[]>(`${this.matchesbdUrl}/date/${date}`);
    }

    getMatchesByDay(date: string): Observable<MatchesByDayResponse[]> {
        return this.http.get<MatchesByDayResponse[]>(`${this.matchesbdUrl}?date=${date}`);
        /*return this.http.get<MatchesByDayResponse[]>(`${this.matchesbdUrl}?date=${date}`).pipe(
            map(response => response.map(day => ({
                ...day,
                season: {
                    ...day.season,
                    startDate: new Date(day.season.startDate),
                    endDate: new Date(day.season.endDate)
                },
                matches: day.matches.map(match => ({
                    ...match,
                    date: new Date(match.date),
                    homeTeam: match.homeTeam ? { ...match.homeTeam } : null,
                    awayTeam: match.awayTeam ? { ...match.awayTeam } : null
                }))
            })))
        );*/
    }

    getMatchesByDayFiltered(date: string, status: string[]): Observable<MatchesByDayResponse[]> {
        console.log((`${this.matchesByDayFilteredUrl}?date=${date}&status=${status.join(',')}`));
        return this.http.get<MatchesByDayResponse[]>(`${this.matchesByDayFilteredUrl}?date=${date}&status=${status.join(',')}`);
    }
}

