import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerStatistic } from '../../models/real-time/player-statistic.model';

@Injectable({
    providedIn: 'root'
})

export class PlayerStatisticService {    
    private apiUrl = environment.services.realTime.endpoints.playerSeasonStats;

    constructor(private http: HttpClient) {}

    getPlayerStatisticsBySeason(season_id: number, player_id?: number): Observable<PlayerStatistic> {
        console.log(`${this.apiUrl}/${player_id}?season_id=${season_id}`);
        return this.http.get<PlayerStatistic>(`${this.apiUrl}/${player_id}?season_id=${season_id}`);
    }
}