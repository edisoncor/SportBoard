import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerMatchStatistic } from '../../models/real-time/player-match-statistic.model';

@Injectable({
    providedIn: 'root'
})

export class PlayerMatchStatisticService {
    private apiUrl = environment.services.realTime.endpoints.playersMatchStats;

    constructor(private http: HttpClient) {}

    getPlayersMatchStatisticsByMatch(match_id: number, team_id?: number): Observable<PlayerMatchStatistic[]> {
        console.log(`${this.apiUrl}/${match_id}/player-stats?team_id=${team_id}`);
        return this.http.get<PlayerMatchStatistic[]>(`${this.apiUrl}/${match_id}/player-stats?team_id=${team_id}`);
    }
}