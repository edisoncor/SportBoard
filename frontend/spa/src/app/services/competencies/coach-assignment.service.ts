import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoachAssignment } from '../../models/competencies/coach-assignment.model';

@Injectable({
    providedIn: 'root'
})
export class CoachAssignmentService {
    private apiUrl = environment.services.competencies.endpoints.coachAssignments;

    constructor(private http: HttpClient) {}

    getCoachAssignments(): Observable<CoachAssignment[]> {
        return this.http.get<CoachAssignment[]>(this.apiUrl);
    }

    getCoachAssignment(id: number): Observable<CoachAssignment> {
        return this.http.get<CoachAssignment>(`${this.apiUrl}/${id}`);
    }

    createCoachAssignment(coachAssignment: CoachAssignment): Observable<CoachAssignment> {
        return this.http.post<CoachAssignment>(this.apiUrl, coachAssignment);
    }

    updateCoachAssignment(id: number, coachAssignment: CoachAssignment): Observable<CoachAssignment> {
        return this.http.put<CoachAssignment>(`${this.apiUrl}/${id}`, coachAssignment);
    }

    deleteCoachAssignment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
