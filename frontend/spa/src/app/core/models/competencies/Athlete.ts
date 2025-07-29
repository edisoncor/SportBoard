/**
 * Modelo para la entidad Athlete del microservicio de competencias
 */

import { CompetencyUser } from './User';

export interface Athlete {
  id?: number;
  user: number | CompetencyUser;
  position: string;
  height: number;
  weight: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAthleteDto {
  user: number;
  position: string;
  height: number;
  weight: number;
  isActive?: boolean;
}

export interface UpdateAthleteDto {
  user?: number;
  position?: string;
  height?: number;
  weight?: number;
  isActive?: boolean;
}
