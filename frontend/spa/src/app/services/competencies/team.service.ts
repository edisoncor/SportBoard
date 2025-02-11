import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team } from '../../models/competencies/team.model';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private apiUrl = environment.services.competencies.endpoints.teams;

    constructor(private http: HttpClient) {}

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.apiUrl);
    }

    getTeam(id: number): Observable<Team> {
        return this.http.get<Team>(`${this.apiUrl}${id}/`);
    }

    createTeam(team: FormData): Observable<Team> {
        return this.http.post<Team>(this.apiUrl, team);
    }

    updateTeam(id: number, team: FormData): Observable<Team> {
        return this.http.put<Team>(`${this.apiUrl}${id}/`, team);
    }

    deleteTeam(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
