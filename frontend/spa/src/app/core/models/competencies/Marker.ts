/**
 * Modelo para marcadores de juego
 */
export interface Marker {
  id: number;
  local: number;
  visitor: number;
  game: number;
}

/**
 * DTO para crear un nuevo marcador
 */
export interface CreateMarkerDto {
  local: number;
  visitor: number;
  game: number;
}

/**
 * DTO para actualizar un marcador existente
 */
export interface UpdateMarkerDto {
  local?: number;
  visitor?: number;
  game?: number;
}
