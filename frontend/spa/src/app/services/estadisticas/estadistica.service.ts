import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap, timeout, map, switchMap, retry } from "rxjs/operators";
import { environment } from "../../../environments/environment";

interface PDFResponse {
  success: boolean;
  message: string;
  filename: string;
  content?: Blob;
  createdAt?: string;
}


@Injectable({
  providedIn: "root",
})
export class EstadisticasService {
  private apiUrl = environment.services.statistics.base
  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzcG9ydGJvYXJkLXN0YXRpc3RpY3MiLCJleHAiOjE3Mzk1MDM1NDgsImlhdCI6MTczOTQxNzE0OH0.6qWxgls3F2adj2rbwIrvVWeUMPRk9RpWm_GR1i_cPVo"

  constructor(private http: HttpClient) { }

  setToken(bearerToken: string): void {
    this.token = bearerToken;
  }

  private getHeaders(isBlob = false): HttpHeaders {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    if (!isBlob) {
      headers = headers.set("Content-Type", "application/json");
    }

    return headers;
  }

  private handleError(error: any) {
    console.error("An error occurred:", error);
    return throwError(() => error);
  }

  getTeams(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.teams, { headers: this.getHeaders() })
  }

  getPlayers(): Observable<any> {
    return this.http.get(environment.services.statistics.endpoints.players, { headers: this.getHeaders() })
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

  generateTeamsPDF(data: any): Observable<PDFResponse> {
    return this.http
      .post<PDFResponse>(`${this.apiUrl}/generate-teams-pdf`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log("PDF generado:", response)),
        catchError(this.handleError),
      )
  }

  generateMatchesPDF(data: any): Observable<PDFResponse> {
    return this.http
      .post<PDFResponse>(`${this.apiUrl}/generate-matches-pdf`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log("PDF generado:", response)),
        catchError(this.handleError),
      )
  }

  generatePlayersPDF(data: any): Observable<PDFResponse> {
    return this.http
      .post<PDFResponse>(`${this.apiUrl}/generate-players-pdf`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log("PDF generado:", response)),
        catchError(this.handleError),
      )
  }

  generateLeaderboardPDF(data: any): Observable<PDFResponse> {
    return this.http
      .post<PDFResponse>(`${this.apiUrl}/generate-leaderboard-pdf`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log("PDF generado:", response)),
        catchError(this.handleError),
      )
  }

  getRecentPDFs(type: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/get-recent-pdfs/${type}`, {
        headers: this.getHeaders(true),
        responseType: 'blob'
      })
      .pipe(
        catchError(error => {
          console.error('Error en getRecentPDFs:', error);
          return throwError(() => error);
        })
      );
  }

  generateAndDownloadPDF(type: string): Observable<PDFResponse> {
    console.log(`Iniciando generación de PDF para tipo: ${type}`);
    return this.http
      .post<PDFResponse>(`${this.apiUrl}/generate-${type}-pdf`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(response => console.log(`Respuesta de generación de PDF:`, response)),
        switchMap(response => {
          if (response.success && response.filename) {
            console.log(`Iniciando descarga para ${response.filename}`);
            return this.downloadGeneratedPDF(type, response.filename).pipe(
              map(blob => ({
                ...response,
                content: blob
              }))
            );
          }
          throw new Error('No se pudo generar el PDF');
        }),
        catchError((error) => {
          console.error('Error en generateAndDownloadPDF:', error);
          return throwError(() => error);
        })
      );
  }

  private downloadGeneratedPDF(type: string, filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-pdf/${type}/${filename}`, {
      headers: this.getHeaders(true),
      responseType: 'blob'
    }).pipe(
      retry(3), // Intentar la descarga hasta 3 veces
      catchError((error: HttpErrorResponse) => {
        console.error('Error al descargar el PDF generado:', error);
        if (error.status === 503) {
          return throwError(() => new Error('El servidor está temporalmente no disponible. Por favor, intente nuevamente en unos momentos.'));
        }
        return throwError(() => new Error('Error al descargar el PDF generado. Por favor, intente nuevamente.'));
      })
    );
  }

  downloadPDFByFilename(type: string, filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-pdf/${type}/${filename}`, {
      headers: this.getHeaders(true),
      responseType: 'blob'
    }).pipe(
      retry(3), // Intentar la descarga hasta 3 veces
      catchError((error: HttpErrorResponse) => {
        console.error('Error al descargar el PDF:', error);
        if (error.status === 503) {
          return throwError(() => new Error('El servidor está temporalmente no disponible. Por favor, intente nuevamente en unos momentos.'));
        }
        return throwError(() => new Error('Error al descargar el PDF. Por favor, intente nuevamente.'));
      })
    );
  }

}

