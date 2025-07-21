import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { catchError, map, retry, mergeMap, expand, reduce, tap } from 'rxjs/operators';

import { Category, Item, CreateCategoryDto, UpdateCategoryDto, CreateItemRequest, UpdateItemRequest } from '../../models/catalogs';
import { ApiResponse, ApiPaginationResponse } from '../../models/api-response';
import { ApiUrlBuilder } from '../../config/api-endpoints';

/**
 * Servicio para gestionar operaciones de catálogos
 * Maneja categorías e items del sistema de catálogos
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient) {}

  // ==================== CATEGORÍAS ====================

  /**
   * Obtiene todas las categorías disponibles (todas las páginas)
   * @returns Observable con array completo de categorías
   */
  getCategories(): Observable<Category[]> {
    console.log('🔍 DEBUG - Iniciando carga completa de categorías...');

    return this.getAllPages<Category>(ApiUrlBuilder.getCategoriesUrl()).pipe(
      tap((categories: Category[]) => console.log(`🔍 DEBUG - Categorías cargadas: ${categories.length}`))
    );
  }  /**
   * Obtiene una categoría por su código
   * @param code Código de la categoría
   * @returns Observable con la categoría
   */
  getCategoryByCode(code: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${ApiUrlBuilder.getCategoriesUrl()}${code}/`)
      .pipe(
        map(response => response.data), // Extraer solo los datos del wrapper
        catchError(this.handleError)
      );
  }

  /**
   * Crea una nueva categoría
   * @param categoryData Datos de la categoría a crear
   * @returns Observable con la categoría creada
   */
  createCategory(categoryData: CreateCategoryDto): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(ApiUrlBuilder.getCategoriesUrl(), categoryData)
      .pipe(
        map(response => response.data), // Extraer solo los datos del wrapper
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza una categoría existente
   * @param code Código de la categoría
   * @param categoryData Datos a actualizar
   * @returns Observable con la categoría actualizada
   */
  updateCategory(code: string, categoryData: UpdateCategoryDto): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${ApiUrlBuilder.getCategoriesUrl()}${code}/`, categoryData)
      .pipe(
        map(response => response.data), // Extraer solo los datos del wrapper
        catchError(this.handleError)
      );
  }

  /**
   * Elimina una categoría
   * @param code Código de la categoría a eliminar
   * @returns Observable void
   */
  deleteCategory(code: string): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getCategoriesUrl()}${code}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ==================== ITEMS ====================

  /**
   * Obtiene todos los items disponibles (todas las páginas válidas)
   * @returns Observable con array completo de items
   */
  getItems(): Observable<Item[]> {
    console.log('🔍 DEBUG - Iniciando carga completa de items...');

    return this.getAllPages<Item>(ApiUrlBuilder.getItemsUrl()).pipe(
      tap((items: Item[]) => {
        const totalExpected = 1974;
        const loadedPercentage = Math.round((items.length / totalExpected) * 100);
        console.log(`🔍 DEBUG - Items cargados: ${items.length} de ${totalExpected} total (${loadedPercentage}%)`);

        if (items.length < totalExpected) {
          console.warn(`⚠️ ADVERTENCIA - Algunas páginas tuvieron errores. Datos parciales cargados.`);
        }
      })
    );
  }

  /**
   * Obtiene todas las páginas de un endpoint paginado
   * @param baseUrl URL base del endpoint
   * @returns Observable con todos los elementos
   */
  private getAllPages<T>(baseUrl: string): Observable<T[]> {
    const firstPageUrl = `${baseUrl}?page=1&page_size=100`;
    let pageCount = 0;
    const maxPages = 25; // Límite de seguridad

    return this.http.get<ApiPaginationResponse<T>>(firstPageUrl).pipe(
      expand((response, index) => {
        pageCount++;
        console.log(`🔍 DEBUG - Página ${pageCount} cargada, ${response.data.length} elementos`);

        if (pageCount >= maxPages) {
          console.warn(`⚠️ ADVERTENCIA - Límite de páginas alcanzado (${maxPages})`);
          return EMPTY;
        }

        if (response.meta.pagination.next) {
          const nextUrl = this.convertToKongUrl(response.meta.pagination.next);
          console.log(`🔍 DEBUG - Cargando siguiente página: ${nextUrl}`);

          return this.http.get<ApiPaginationResponse<T>>(nextUrl).pipe(
            catchError((error) => {
              console.error(`❌ Error en página ${pageCount + 1}:`, error);
              // Si hay error en una página, continuamos sin ella
              return EMPTY;
            })
          );
        }

        return EMPTY;
      }),
      map(response => response.data),
      reduce((acc: T[], curr: T[]) => [...acc, ...curr], []),
      catchError(this.handleError)
    );
  }

  /**
   * Convierte una URL del microservicio a URL de Kong
   * @param microserviceUrl URL del microservicio
   * @returns URL de Kong
   */
  private convertToKongUrl(microserviceUrl: string): string {
    if (microserviceUrl.includes('ms-catalog:8009/api/v1/catalog/items')) {
      return microserviceUrl.replace('http://ms-catalog:8009/api/v1/catalog/items', 'http://localhost:8000/catalog/items');
    }
    if (microserviceUrl.includes('ms-catalog:8009/api/v1/catalog/categories')) {
      return microserviceUrl.replace('http://ms-catalog:8009/api/v1/catalog/categories', 'http://localhost:8000/catalog/categories');
    }
    return microserviceUrl;
  }

  /**
   * Obtiene un item por su código
   * @param code Código del item
   * @returns Observable con el item
   */
  getItemByCode(code: string): Observable<Item> {
    return this.http.get<Item>(`${ApiUrlBuilder.getItemsUrl()}${code}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene items filtrados por categoría
   * @param categoryCode Código de la categoría
   * @returns Observable con array de items de la categoría
   */
  getItemsByCategory(categoryCode: string): Observable<Item[]> {
    return this.http.get<ApiPaginationResponse<Item>>(`${ApiUrlBuilder.getItemsUrl()}?category=${categoryCode}`)
      .pipe(
        map(response => response.data), // Extraer solo los datos del wrapper
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo item
   * @param itemData Datos del item a crear
   * @returns Observable con el item creado
   */
  createItem(itemData: CreateItemRequest): Observable<Item> {
    return this.http.post<Item>(ApiUrlBuilder.getItemsUrl(), itemData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un item existente
   * @param code Código del item
   * @param itemData Datos a actualizar
   * @returns Observable con el item actualizado
   */
  updateItem(code: string, itemData: UpdateItemRequest): Observable<Item> {
    return this.http.put<Item>(`${ApiUrlBuilder.getItemsUrl()}${code}/`, itemData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un item
   * @param code Código del item a eliminar
   * @returns Observable void
   */
  deleteItem(code: string): Observable<void> {
    return this.http.delete<void>(`${ApiUrlBuilder.getItemsUrl()}${code}/`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Maneja errores HTTP de manera centralizada
   * @param error Error HTTP recibido
   * @returns Observable con error procesado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicie sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. No tiene permisos para esta operación.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente más tarde.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    console.error('Error en CatalogService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
