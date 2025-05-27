import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Catalog } from '../../models/catalogs/catalog.model';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private apiUrl = environment.services.catalog.endpoints.catalogs;

    constructor(private http: HttpClient) {}

    getCatalogs(): Observable<Catalog[]> {
        return this.http.get<Catalog[]>(this.apiUrl);
    }

    getCatalog(id: number): Observable<Catalog> {
        return this.http.get<Catalog>(`${this.apiUrl}/${id}`);
    }

    createCatalog(catalog: Catalog): Observable<Catalog> {
        // Asegúrate de que el objeto catalog tenga todos los campos necesarios, incluyendo idCatalog
        return this.http.post<Catalog>(this.apiUrl, catalog);
    }

    updateCatalog(id: number, catalog: Catalog): Observable<Catalog> {
        console.log('catalog', catalog);
        // Asegúrate de que el objeto catalog tenga todos los campos necesarios, incluyendo idCatalog
        return this.http.put<Catalog>(`${this.apiUrl}/${id}`, catalog);
    }

    deleteCatalog(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateCatalogWithGroup(id: number, catalog: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, catalog);
    }

    

    getCountries(): Observable<Catalog[]> {
        return this.getCatalogs().pipe(
            map((catalogs: Catalog[]) => 
                catalogs.filter((catalog: Catalog) => catalog.groupCode === 'PAIS')
            )
        );
    }

    getGenders(): Observable<Catalog[]> {
        return this.getCatalogs().pipe(
            map((catalogs: Catalog[]) => 
                catalogs.filter((catalog: Catalog) => catalog.groupCode === 'TIPO_SEXO')
            )
        );
    }

    getNationalities(): Observable<Catalog[]> {
        return this.getCatalogs().pipe(
            map((catalogs: Catalog[]) => 
                catalogs.filter((catalog: Catalog) => catalog.groupCode === 'NACIONALIDAD')
            )
        );
    }
}
