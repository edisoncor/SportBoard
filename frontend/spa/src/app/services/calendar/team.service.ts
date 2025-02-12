import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentCalendar1 } from '../../../environments/environmentCalendar';
import { Team } from '../../models/calendar/team.model';
import { Match } from '../../models/calendar/match.model';
import { Calendar } from '../../models/calendar/calendar.model';

@Injectable({
    providedIn: 'root'
})
export class TeamService {

    private getAllUrl = environmentCalendar1.services.teams.endpoints.getAll;
    private getByIdUrl = environmentCalendar1.services.teams.endpoints.getById;
    private createUrl = environmentCalendar1.services.teams.endpoints.create;
    private updateUrl = environmentCalendar1.services.teams.endpoints.update;
    private deleteUrl = environmentCalendar1.services.teams.endpoints.delete;
    private teamsUrl = environmentCalendar1.services.teams.endpoints.equip;
    private equiposUrl = 'http://localhost:9000/api/teams';
    private getAllCalendarsUrl = 'http://localhost:9000/api/calendars';
    private createCalendarUrl = 'http://localhost:9000/api/calendars';

    constructor(private httpClient: HttpClient) { }

    // CALENDARIOS
    getAllCalendars(): Observable<Calendar[]> {
        return this.httpClient.get<Calendar[]>(this.getAllCalendarsUrl);
    }

    // Obtener un calendario por su ID
    getCalendarById(id: number): Observable<string> {
        const url = this.getByIdUrl.replace('{id}', id.toString());
        return this.httpClient.get<string>(url);
    }

    // Crear un nuevo calendario
    createCalendar(calendar: Calendar): Observable<Calendar> {
        return this.httpClient.post<Calendar>(this.createCalendarUrl, calendar);
    }

    // Metodos para teams
    // Obtener teams
    getTeams(): Observable<Team[]> {
        return this.httpClient.get<Team[]>(this.equiposUrl);
    }

    // Eliminar equipo por ID
    deleteTeam(id: number): Observable<void> {
        const url = this.teamsUrl.replace('{id}', id.toString());
        return this.httpClient.delete<void>(url);
    }

    // Crear un nuevo partido
    createMatch(match: Match): Observable<Match> {
        return this.httpClient.post<Match>(`${this.createCalendarUrl}/matches`, match);
    }

    // Obtener partidos
    getMatches(): Observable<Match[]> {
        return this.httpClient.get<Match[]>(`${this.getAllCalendarsUrl}/matches`);
    }
}
