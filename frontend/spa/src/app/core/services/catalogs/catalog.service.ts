import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, EMPTY } from 'rxjs';
import { catchError, map, retry, mergeMap, expand, reduce } from 'rxjs/operators';

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
    const urlWithLargePageSize = `${ApiUrlBuilder.getCategoriesUrl()}?page_size=1000`;
    console.log('🔍 DEBUG - getCategories() URL:', urlWithLargePageSize);

    return this.http.get<ApiPaginationResponse<Category>>(urlWithLargePageSize)
      .pipe(
        retry(2),
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
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
   * Obtiene todos los items disponibles (todas las páginas)
   * @returns Observable con array completo de items
   */
  getItems(): Observable<Item[]> {
    const urlWithLargePageSize = `${ApiUrlBuilder.getItemsUrl()}?page_size=5000`;
    console.log('🔍 DEBUG - getItems() URL:', urlWithLargePageSize);

    return this.http.get<ApiPaginationResponse<Item>>(urlWithLargePageSize)
      .pipe(
        retry(2),
        map(response => response.data),
        catchError(this.handleError)
      );
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
