import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Interceptor HTTP para manejar las comunicaciones con Kong API Gateway
 * Agrega logging, manejo de errores y headers necesarios para la integración
 */
@Injectable()
export class KongInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Preparar headers base
    const headers: { [key: string]: string } = {
      // Agregar header para identificar el origen de la petición
      'X-Client-Name': 'SportBoard-SPA',
      'X-Client-Version': '1.0.0'
    };

    // Solo agregar Content-Type para peticiones con body (POST, PUT, PATCH)
    if (request.method !== 'GET' && request.method !== 'DELETE' && request.method !== 'HEAD' && request.body !== null) {
      headers['Content-Type'] = 'application/json';
    }

    // Siempre agregar Accept para respuestas
    headers['Accept'] = 'application/json';

    // Agregar headers necesarios para Kong
    const modifiedRequest = request.clone({
      setHeaders: headers
    });

    // Solo mostrar logs en desarrollo y para errores
    const isProduction = false; // En producción esto sería true
    
    if (!isProduction) {
      console.log(`🚀 HTTP Request: ${modifiedRequest.method} ${modifiedRequest.url}`);
    }
    
    return next.handle(modifiedRequest).pipe(
      tap(event => {
        if (event instanceof HttpResponse && !isProduction) {
          console.log(`✅ HTTP Response: ${event.status} ${event.url}`);
          
          // Log específico para respuestas del microservicio de competencias
          if (event.url?.includes('/competencies/')) {
            console.log('📊 Competencies Service Response:', {
              status: event.status,
              url: event.url,
              dataCount: Array.isArray(event.body?.data) ? event.body.data.length : 'single',
              message: event.body?.message
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ HTTP Error: ${error.status} ${error.url}`, error);
        
        // Manejo específico de errores de Kong
        if (error.status === 503) {
          console.error('🚨 Kong Service Unavailable - Check if microservices are running');
        } else if (error.status === 404 && error.url?.includes('/competencies/')) {
          console.error('🚨 Competencies Service Not Found - Check Kong configuration');
        } else if (error.status === 0) {
          console.error('🚨 Network Error - Check if Kong is running on port 8000');
        }

        // Transformar el error para proporcionar mensajes más amigables
        const userFriendlyError = this.transformError(error);
        return throwError(() => userFriendlyError);
      })
    );
  }

  /**
   * Transforma errores HTTP en mensajes más amigables para el usuario
   */
  private transformError(error: HttpErrorResponse): Error {
    let message = 'Ha ocurrido un error inesperado';

    switch (error.status) {
      case 0:
        message = 'No se puede conectar al servidor. Verifique su conexión a internet.';
        break;
      case 400:
        message = 'Los datos enviados no son válidos.';
        break;
      case 401:
        message = 'No está autorizado para realizar esta acción.';
        break;
      case 403:
        message = 'No tiene permisos para acceder a este recurso.';
        break;
      case 404:
        message = 'El recurso solicitado no fue encontrado.';
        break;
      case 500:
        message = 'Error interno del servidor. Intente nuevamente más tarde.';
        break;
      case 503:
        message = 'El servicio no está disponible temporalmente.';
        break;
      default:
        message = `Error del servidor: ${error.status}`;
    }

    return new Error(message);
  }
}
