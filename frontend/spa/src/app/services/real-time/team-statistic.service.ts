import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team } from '../../models/real-time/team.model';
import { TeamStatistic } from '../../models/real-time/team-statistic.model';

@Injectable({
    providedIn: 'root'
})

export class TeamStatisticService {
    private apiUrl = environment.services.realTime.endpoints.teams;
    private apiUrlTeamStatistics = environment.services.realTime.endpoints.teamClassification;

    constructor(private http: HttpClient) {}

    getTeamStatistics(): Observable<TeamStatistic[]> {
        return this.http.get<TeamStatistic[]>(this.apiUrl);
    }

    getTeamStatistic(id: number): Observable<TeamStatistic> {
        return this.http.get<TeamStatistic>(`${this.apiUrl}/${id}`);
    }

    createTeamStatistic(teamStatistic: TeamStatistic): Observable<TeamStatistic> {
        return this.http.post<TeamStatistic>(this.apiUrl, teamStatistic);
    }

    updateTeamStatistic(id: number, teamStatistic: TeamStatistic): Observable<TeamStatistic> {
        return this.http.put<TeamStatistic>(`${this.apiUrl}/${id}`, teamStatistic);
    }

    deleteTeamStatistic(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getSeasonTeamStatistics(season_id: number): Observable<TeamStatistic[]> {
        return this.http.get<TeamStatistic[]>(`${this.apiUrlTeamStatistics}?season_id=${season_id}`);
    }
}