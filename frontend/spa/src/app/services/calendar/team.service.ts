import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environmentCalendar1} from '../../../environments/environmentCalendar';


@Injectable({
    providedIn: 'root'
})
export class TeamService {

    private getAllUrl = environmentCalendar1.services.teams.endpoints.getAll;
    private getByIdUrl = environmentCalendar1.services.teams.endpoints.getById;
    private createUrl = environmentCalendar1.services.teams.endpoints.create;
    private updateUrl = environmentCalendar1.services.teams.endpoints.update;
    private deleteUrl = environmentCalendar1.services.teams.endpoints.delete;
    private equiposUrl = environmentCalendar1.services.teams.endpoints.equip;
    constructor(private httpClient: HttpClient) { }

    // Obtener todos los calendarios
    getAllCalendars(): Observable<string[]> {
        return this.httpClient.get<string[]>(this.getAllUrl);
    }
    getAllTeams(): Observable<string[]> {
        return this.httpClient.get<string[]>(this.equiposUrl);  // Usar equiposUrl en lugar de getAllUrl
    }

    deleteTeam(id: number): Observable<void> {
        const url = this.equiposUrl.replace('{id}', id.toString());  // Asegurar que la URL es para equipos
        return this.httpClient.delete<void>(url);
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


    getEquipos(): Observable<string[]> {
        return this.httpClient.get<string[]>(this.equiposUrl, {
            headers: new HttpHeaders({
                'Accept': 'application/json'  // Cambiar a 'application/json' en lugar de 'text/plain'
            })
        });
    }



}
