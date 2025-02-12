import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private baseUrl = 'http://localhost:8000/api/estadisticas';
  private token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzcG9ydGJvYXJkLXN0YXRpc3RpY3MiLCJleHAiOjE3Mzk0MTY4NTQsImlhdCI6MTczOTMzMDQ1NH0.hd57Nl3_BujtaVum2cHJzkhTej31MYhFtyeg-xBbXo8';

  constructor(private http: HttpClient) {}

  setToken(bearerToken: string): void {
    this.token = bearerToken;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }
  
  // Obtener equipos
  getTeams(): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams`, { headers: this.getHeaders() });
  }

  // Obtener partidos
  getMatches(): Observable<any> {
    console.log('Enviando solicitud a: ', `${this.baseUrl}/matches`); 
    return this.http.get(`${this.baseUrl}/matches`, { headers: this.getHeaders() });
  }

  // Obtener competiciones
  getCompetition(): Observable<any> {
    return this.http.get(`${this.baseUrl}/competition`, { headers: this.getHeaders() });
  }

  // Obtener partidos próximos
  getUpcomingMatches(): Observable<any> {
    return this.http.get(`${this.baseUrl}/upcomingMatches`, { headers: this.getHeaders() });
  }

  // Obtener tabla de posiciones
  getLeaderboards(): Observable<any> {
    return this.http.get(`${this.baseUrl}/leaderboards`, { headers: this.getHeaders() });
  }

  // Obtener jugadores
  getPlayers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/players`, { headers: this.getHeaders() });
  }

  // Generar PDF de equipos
  generateTeamsPDF(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate-teams-pdf`, data, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  // Descargar PDF guardado
  downloadPDF(pdfName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-pdf/${pdfName}`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }
}