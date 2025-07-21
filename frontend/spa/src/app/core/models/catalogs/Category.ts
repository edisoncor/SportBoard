/**
 * Modelo para categorías de catálogo
 * Representa una categoría que puede contener items y tener jerarquía
 */
export interface Category {
  /** URL única de la categoría (usado como ID en el backend) */
  url: string;

  /** Nombre de la categoría */
  name: string;

  /** Código único de la categoría */
  code: string;

  /** Descripción de la categoría */
  description?: string | null;

  /** Nivel jerárquico de la categoría */
  level: number;

  /** Versión de la categoría */
  version: number;

  /** Indica si la categoría está activa */
  isActive: boolean;

  /** URL de la categoría padre (para jerarquía) */
  parent_catalog?: string | null;

  /** URLs de las categorías hijas */
  child_catalogs: string[];

  /** Fecha de creación */
  createdAt?: Date;

  /** Fecha de última actualización */
  updatedAt?: Date;
}

/**
 * Helper para obtener el ID numérico de una categoría desde su URL
 */
export function getCategoryIdFromUrl(url: string): number | null {
  const match = url.match(/\/([^\/]+)\/$/);
  return match ? parseInt(match[1]) || null : null;
}

/**
 * Helper para obtener el código de una categoría desde su URL
 */
export function getCategoryCodeFromUrl(url: string): string | null {
  const match = url.match(/\/([^\/]+)\/$/);
  return match ? match[1] : null;
}

/**
 * DTO para crear una nueva categoría
 */
export interface CreateCategoryDto {
  name: string;
  code: string;
  description?: string;
  level?: number;
  parent_catalog?: string;
}

/**
 * DTO para actualizar una categoría existente
 */
export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  level?: number;
  isActive?: boolean;
  parent_catalog?: string;
}
