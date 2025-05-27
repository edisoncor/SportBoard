import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Group } from '../../models/catalogs/group.model';

@Injectable({
    providedIn: 'root',
})
export class GroupService {
    private baseUrl = environment.services.catalog.endpoints.groups;

    constructor(private http: HttpClient) {}

    getAllGroups(): Observable<Group[]> {
        return this.http.get<Group[]>(this.baseUrl);
    }

    getGroupById(code: string): Observable<Group> {
        return this.http.get<Group>(`${this.baseUrl}/${code}`);
    }

    createGroup(group: Group): Observable<Group> {
        return this.http.post<Group>(this.baseUrl, group);
    }

    updateGroup(code: string, group: Group): Observable<Group> {
        return this.http.put<Group>(`${this.baseUrl}/${code}`, group);
    }

    deleteGroup(code: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${code}`);
    }
}
