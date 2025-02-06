import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Nacionality } from "../../models/user_manage/nacionality.model";

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private apiUrl = environment.services.user_manage.endpoints.nacionalities;
    
    constructor(private http: HttpClient) { }
    
    getCountries(): Observable<Nacionality[]> {
        return this.http.get<Nacionality[]>(this.apiUrl);
    }

    getCountry(id: number): Observable<Nacionality> {
        return this.http.get<Nacionality>(`${this.apiUrl}/${id}`);
    }

    createCountry(country: Nacionality): Observable<Nacionality> {
        return this.http.post<Nacionality>(this.apiUrl, country);
    }

    updateCountry(id: number, country: Nacionality): Observable<Nacionality> {
        return this.http.put<Nacionality>(`${this.apiUrl}/${id}`, country);
    }

    deleteCountry(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}