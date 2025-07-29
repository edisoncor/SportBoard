/**
 * Modelo para la entidad Phase del microservicio de competencias
 */

import { Season } from './Season';
import { CompetencyCategory } from './Category';

export interface Phase {
  id?: number;
  name: string;
  description: string;
  modality: number; // Catalogue FK
  season: number | Season;
  category: number | CompetencyCategory;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePhaseDto {
  name: string;
  description: string;
  modality: number;
  season: number;
  category: number;
  isActive?: boolean;
}

export interface UpdatePhaseDto {
  name?: string;
  description?: string;
  modality?: number;
  season?: number;
  category?: number;
  isActive?: boolean;
}
