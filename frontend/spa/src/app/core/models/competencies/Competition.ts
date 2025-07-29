/**
 * Modelo para la entidad Competition del microservicio de competencias
 */

import { Administration } from './Administration';

export interface Competition {
  id?: number;
  name: string;
  creationDate?: Date;
  administration: number | Administration;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCompetitionDto {
  name: string;
  administration: number;
}

export interface UpdateCompetitionDto {
  name?: string;
  administration?: number;
}
