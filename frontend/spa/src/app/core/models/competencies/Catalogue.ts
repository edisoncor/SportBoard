/**
 * Modelo para el catálogo de elementos
 */
export interface Catalogue {
  id: number;
  code: string;
  description: string;
  parent_catalog?: number;
}

/**
 * DTO para crear un nuevo catálogo
 */
export interface CreateCatalogueDto {
  code: string;
  description: string;
  parent_catalog?: number;
}

/**
 * DTO para actualizar un catálogo existente
 */
export interface UpdateCatalogueDto {
  code?: string;
  description?: string;
  parent_catalog?: number;
}
