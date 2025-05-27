import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogoCatalog } from '../../models/competencies/logo-catalog.model';

@Injectable({
    providedIn: 'root'
})
export class LogoCatalogService {
    private apiUrl = environment.services.competencies.endpoints.logoCatalogs;

    constructor(private http: HttpClient) {}

    getLogoCatalogs(): Observable<LogoCatalog[]> {
        return this.http.get<LogoCatalog[]>(this.apiUrl);
    }

    getLogoCatalog(id: number): Observable<LogoCatalog> {
        return this.http.get<LogoCatalog>(`${this.apiUrl}/${id}`);
    }

    createLogoCatalog(logoCatalog: LogoCatalog): Observable<LogoCatalog> {
        return this.http.post<LogoCatalog>(this.apiUrl, logoCatalog);
    }

    updateLogoCatalog(id: number, logoCatalog: LogoCatalog): Observable<LogoCatalog> {
        return this.http.put<LogoCatalog>(`${this.apiUrl}/${id}`, logoCatalog);
    }

    deleteLogoCatalog(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
