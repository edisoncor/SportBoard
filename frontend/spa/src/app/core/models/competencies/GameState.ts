/**
 * Modelo para la entidad GameState del microservicio de competencias
 */

export interface GameState {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGameStateDto {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateGameStateDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}
