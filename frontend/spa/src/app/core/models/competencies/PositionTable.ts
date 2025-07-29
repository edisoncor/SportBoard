/**
 * Modelo para tabla de posiciones
 */
export interface PositionTable {
  id: number;
  position: number;
  points: number;
  team: number;
}

/**
 * DTO para crear una nueva entrada de tabla de posiciones
 */
export interface CreatePositionTableDto {
  position: number;
  points: number;
  team: number;
}

/**
 * DTO para actualizar una entrada de tabla de posiciones
 */
export interface UpdatePositionTableDto {
  position?: number;
  points?: number;
  team?: number;
}
