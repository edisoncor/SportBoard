import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registration } from '../../models/competencies/registration.model';
import { RegistrationDTO } from '../../models/competencies/registration-dto.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
    private apiUrl = environment.services.competencies.endpoints.registrations;

  constructor(private http: HttpClient) { }

  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl);
  }

  getRegistration(id: number): Observable<Registration> {
    return this.http.get<Registration>(`${this.apiUrl}${id}/`);
  }

  createRegistration(registrationDto: RegistrationDTO): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, registrationDto);
  }

  updateRegistration(id: number, registrationDto: RegistrationDTO): Observable<Registration> {
    return this.http.put<Registration>(`${this.apiUrl}${id}/`, registrationDto);
  }

  deleteRegistration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
