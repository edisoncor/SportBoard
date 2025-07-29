/**
 * Modelo para la entidad Team del microservicio de competencias
 */

import { CompetencyCategory } from './Category';

export interface Team {
  id?: number;
  name: string;
  nationality: number; // Catalogue FK
  category?: number | CompetencyCategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTeamDto {
  name: string;
  nationality: number;
  category?: number;
}

export interface UpdateTeamDto {
  name?: string;
  nationality?: number;
  category?: number;
}
