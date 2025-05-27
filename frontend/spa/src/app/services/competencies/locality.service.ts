import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Locality } from '../../models/competencies/locality.model';

@Injectable({
    providedIn: 'root'
})
export class LocalityService {
    private apiUrl = environment.services.competencies.endpoints.localities;

    constructor(private http: HttpClient) {}

    getLocalities(): Observable<Locality[]> {
        return this.http.get<Locality[]>(this.apiUrl);
    }

    getLocality(id: number): Observable<Locality> {
        return this.http.get<Locality>(`${this.apiUrl}/${id}`);
    }

    createLocality(locality: Locality): Observable<Locality> {
        return this.http.post<Locality>(this.apiUrl, locality);
    }

    updateLocality(id: number, locality: Locality): Observable<Locality> {
        return this.http.put<Locality>(`${this.apiUrl}/${id}`, locality);
    }

    deleteLocality(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
