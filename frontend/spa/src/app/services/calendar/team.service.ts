import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentCalendar1 } from '../../../environments/environmentCalendar';
import { Team } from '../../models/calendar/team.model';

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
    constructor(private httpClient: HttpClient) { }

    // CALENDARIOS
    getAllCalendars(): Observable<string[]> {
        return this.httpClient.get<string[]>(this.getAllUrl);
    }


    // Obtener un calendario por su ID
    getCalendarById(id: number): Observable<string> {
        const url = this.getByIdUrl.replace('{id}', id.toString());
        return this.httpClient.get<string>(url);
    }

    // Crear un nuevo calendario
    createCalendar(calendar: string): Observable<string> {
        return this.httpClient.post<string>(this.createUrl, calendar, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    // Metodos para teams
    // Obtener teams
    getTeams(): Observable<Team[]> {
        return this.httpClient.get<Team[]>(this.teamsUrl, {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        });
    }

    // Eliminar equipo por ID
    deleteTeam(id: number): Observable<void> {
        const url = this.teamsUrl.replace('{id}', id.toString());
        return this.httpClient.delete<void>(url);
    }

}
