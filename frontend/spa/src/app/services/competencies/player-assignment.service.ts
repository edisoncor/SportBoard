import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlayerAssignment } from '../../models/competencies/player-assignment.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerAssignmentService {
    private apiUrl = environment.services.competencies.endpoints.playerAssignments;

    constructor(private http: HttpClient) {}

    getPlayerAssignments(): Observable<PlayerAssignment[]> {
        return this.http.get<PlayerAssignment[]>(this.apiUrl);
    }

    getPlayerAssignment(id: number): Observable<PlayerAssignment> {
        return this.http.get<PlayerAssignment>(`${this.apiUrl}/${id}`);
    }

    createPlayerAssignment(playerAssignment: PlayerAssignment): Observable<PlayerAssignment> {
        return this.http.post<PlayerAssignment>(this.apiUrl, playerAssignment);
    }

    updatePlayerAssignment(id: number, playerAssignment: PlayerAssignment): Observable<PlayerAssignment> {
        return this.http.put<PlayerAssignment>(`${this.apiUrl}/${id}`, playerAssignment);
    }

    deletePlayerAssignment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
