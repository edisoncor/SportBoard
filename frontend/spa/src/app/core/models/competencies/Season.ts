/**
 * Modelo para la entidad Season del microservicio de competencias
 */

import { Competition } from './Competition';

export interface Season {
  id?: number;
  name: string;
  description: string;
  startDate: Date;
  endTime: Date;
  champion: string;
  subChampion: string;
  hasEnd: boolean;
  hasChampion: boolean;
  competition: number | Competition;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSeasonDto {
  name: string;
  description: string;
  startDate: Date;
  endTime: Date;
  champion?: string;
  subChampion?: string;
  hasEnd?: boolean;
  hasChampion?: boolean;
  competition: number;
}

export interface UpdateSeasonDto {
  name?: string;
  description?: string;
  startDate?: Date;
  endTime?: Date;
  champion?: string;
  subChampion?: string;
  hasEnd?: boolean;
  hasChampion?: boolean;
  competition?: number;
}
