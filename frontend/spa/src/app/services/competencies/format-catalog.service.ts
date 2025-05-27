import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormatCatalog } from '../../models/competencies/format-catalog.model';

@Injectable({
    providedIn: 'root'
})
export class FormatCatalogService {
    private apiUrl = environment.services.competencies.endpoints.formatCatalogs;

    constructor(private http: HttpClient) { }

    getFormatCatalogs(): Observable<FormatCatalog[]> {
        return this.http.get<FormatCatalog[]>(this.apiUrl);
    }

    getFormatCatalog(id: number): Observable<FormatCatalog> {
        return this.http.get<FormatCatalog>(`${this.apiUrl}/${id}`);
    }

    createFormatCatalog(formatCatalog: FormatCatalog): Observable<FormatCatalog> {
        return this.http.post<FormatCatalog>(this.apiUrl, formatCatalog);
    }


    updateFormatCatalog(id: number, formatCatalog: FormatCatalog): Observable<FormatCatalog> {
        return this.http.put<FormatCatalog>(`${this.apiUrl}/${id}`, formatCatalog);
    }

    deleteFormatCatalog(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
