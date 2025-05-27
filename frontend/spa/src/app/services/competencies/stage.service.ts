import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stage } from '../../models/competencies/stage.model';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private apiUrl = environment.services.competencies.endpoints.stages;

  constructor(private http: HttpClient) {}

  getStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(this.apiUrl);
  }

  getStage(id: number): Observable<Stage> {
    return this.http.get<Stage>(`${this.apiUrl}${id}/`);
  }

  createStage(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(this.apiUrl, stage);
  }

  updateStage(id: number, stage: Stage): Observable<Stage> {
    return this.http.put<Stage>(`${this.apiUrl}/${id}`, stage);
  }

  deleteStage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
