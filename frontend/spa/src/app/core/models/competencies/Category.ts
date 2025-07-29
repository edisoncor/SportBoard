/**
 * Modelo para la entidad Category del microservicio de competencias
 */

import { Rule } from './Rule';

export interface Category {
  id?: number;
  age_init: number;
  age_end: number;
  name: string;
  rule: number | Rule;
}

export interface CreateCategoryDto {
  age_init: number;
  age_end: number;
  name: string;
  rule: number;
}

export interface UpdateCategoryDto {
  age_init?: number;
  age_end?: number;
  name?: string;
  rule?: number;
}

// Mantenemos los tipos anteriores para retrocompatibilidad
export interface CompetencyCategory extends Category {}
export interface CreateCompetencyCategoryDto extends CreateCategoryDto {}
export interface UpdateCompetencyCategoryDto extends UpdateCategoryDto {}
