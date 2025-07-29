/**
 * Modelo para calificación de tabla
 */
export interface TableRating {
  id: number;
  lastUpdate: string;
  positionTable: number;
}

/**
 * DTO para crear una nueva calificación de tabla
 */
export interface CreateTableRatingDto {
  positionTable: number;
}

/**
 * DTO para actualizar una calificación de tabla
 */
export interface UpdateTableRatingDto {
  positionTable?: number;
}
