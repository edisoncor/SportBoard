/**
 * Modelo para items de catálogo
 * Representa un item que pertenece a una categoría
 */
export interface Item {
  /** URL única del item */
  url: string;

  /** Código de la categoría a la que pertenece */
  category: string;

  /** URL del catálogo padre (para jerarquía) */
  parent_catalog?: string | null;

  /** Nombre del item */
  name: string;

  /** Código único del item */
  code: string;

  /** Descripción del item */
  description?: string;

  /** Versión del item */
  version: number;

  /** Indica si el item está activo */
  isActive: boolean;

  /** Items hijos (para jerarquía) */
  child_catalogs?: Item[];
}

/**
 * DTO para crear un nuevo item
 */
export interface CreateItemRequest {
  name: string;
  code: string;
  description?: string;
  category: string;
  parent_catalog?: string;
}

/**
 * DTO para actualizar un item existente
 */
export interface UpdateItemRequest {
  name?: string;
  code?: string;
  description?: string;
  version?: number;
  isActive?: boolean;
}

// Función helper para extraer el código desde la URL
export function getItemCodeFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 2] || '';
}

// Función helper para verificar si un item tiene elementos hijos
export function hasChildItems(item: Item): boolean {
  return item.child_catalogs ? item.child_catalogs.length > 0 : false;
}
