import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogoItem } from '../../models/competencies/logo-item.model';

@Injectable({
    providedIn: 'root'
})
export class LogoItemService {
    private apiUrl = environment.services.competencies.endpoints.logoItems;

    constructor(private http: HttpClient) {}

    getLogoItems(): Observable<LogoItem[]> {
        return this.http.get<LogoItem[]>(this.apiUrl);
    }

    getLogoItem(id: number): Observable<LogoItem> {
        return this.http.get<LogoItem>(`${this.apiUrl}/${id}`);
    }

    createLogoItem(logoItem: LogoItem): Observable<LogoItem> {
        return this.http.post<LogoItem>(this.apiUrl, logoItem);
    }

    updateLogoItem(id: number, logoItem: LogoItem): Observable<LogoItem> {
        return this.http.put<LogoItem>(`${this.apiUrl}/${id}`, logoItem);
    }

    deleteLogoItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
