import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Format } from "../../models/competencies/format.model";

@Injectable({
    providedIn: 'root'
})
export class FormatService {
    private apiUrl = environment.services.competencies.endpoints.formats;

    constructor(private http: HttpClient) { }
    
    getFormats(): Observable<Format[]> {
        return this.http.get<Format[]>(this.apiUrl);
    }

    getFormat(id: number): Observable<Format> {
        return this.http.get<Format>(`${this.apiUrl}${id}/`);
    }

    createFormat(format: Format): Observable<Format> {
        return this.http.post<Format>(this.apiUrl, format);
    }

    updateFormat(id: number, format: Format): Observable<Format> {
        return this.http.put<Format>(`${this.apiUrl}${id}/`, format);
    }

    deleteFormat(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

}