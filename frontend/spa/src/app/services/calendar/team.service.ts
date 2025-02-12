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
    private equiposUrl = 'http://localhost:9000/api/teams';
    private getAllUrl = 'http://localhost:9000/api/calendars';
    private createUrl = 'http://localhost:9000/api/calendars';

    constructor(private httpClient: HttpClient) { }

    getTeams(): Observable<Team[]> {
        return this.httpClient.get<Team[]>(this.equiposUrl);
    }

    getAllCalendars(): Observable<Calendar[]> {
        return this.httpClient.get<Calendar[]>(this.getAllUrl);
    }

    createCalendar(calendar: Calendar): Observable<Calendar> {
        return this.httpClient.post<Calendar>(this.createUrl, calendar);
    }

    createMatch(match: Match): Observable<Match> {
        return this.httpClient.post<Match>(`${this.createUrl}/matches`, match);
    }

    getMatches(): Observable<Match[]> {
        return this.httpClient.get<Match[]>(`${this.getAllUrl}/matches`);
    }
}
