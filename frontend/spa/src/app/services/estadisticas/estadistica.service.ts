import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class EstadisticasService {
  private apiUrl = environment.services.statistics.base
  private token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzcG9ydGJvYXJkLXN0YXRpc3RpY3MiLCJleHAiOjE3Mzk0MTY4NTQsImlhdCI6MTczOTMzMDQ1NH0.hd57Nl3_BujtaVum2cHJzkhTej31MYhFtyeg-xBbXo8"

  constructor(private http: HttpClient) {}

  setToken(bearerToken: string): void {
    this.token = bearerToken
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    })
  }

  getTeams(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.teams, { headers: this.getHeaders() })
  }

  getMatches(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.matches, { headers: this.getHeaders() })
  }

  getCompetition(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.competition, { headers: this.getHeaders() })
  }

  getUpcomingMatches(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.upcomingMatches, { headers: this.getHeaders() })
  }

  getLeaderboards(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.leaderboards, { headers: this.getHeaders() })
  }

  getPlayers(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.players, { headers: this.getHeaders() })
  }

  generateTeamsPDF(data: any): Observable<Blob> {
    return this.http.post(environment.services.statistics.endpoints.generateTeamsPDF, data, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  generateMatchesPDF(data: any): Observable<Blob> {
    return this.http.post(environment.services.statistics.endpoints.generateMatchesPDF, data, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  generatePlayersPDF(data: any): Observable<Blob> {
    return this.http.post(environment.services.statistics.endpoints.generatePlayersPDF, data, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  generateLeaderboardPDF(data: any): Observable<Blob> {
    return this.http.post(environment.services.statistics.endpoints.generateLeaderboardPDF, data, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  downloadTeamsPDF(name: string): Observable<Blob> {
    return this.http.get(`${environment.services.statistics.endpoints.downloadTeamsPDF}/${name}`, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  downloadMatchesPDF(name: string): Observable<Blob> {
    return this.http.get(`${environment.services.statistics.endpoints.downloadMatchesPDF}/${name}`, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  downloadPlayersPDF(name: string): Observable<Blob> {
    return this.http.get(`${environment.services.statistics.endpoints.downloadPlayersPDF}/${name}`, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }

  downloadLeaderboardPDF(name: string): Observable<Blob> {
    return this.http.get(`${environment.services.statistics.endpoints.downloadLeaderboardPDF}/${name}`, {
      headers: this.getHeaders(),
      responseType: "blob",
    })
  }
}

