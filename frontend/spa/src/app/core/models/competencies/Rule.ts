/**
 * Modelo para la entidad Rule del microservicio de competencias
 */

export interface Rule {
  id?: number;
  name: string;
  description: string;
  level: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRuleDto {
  name: string;
  description: string;
  level: number;
  isActive?: boolean;
}

export interface UpdateRuleDto {
  name?: string;
  description?: string;
  level?: number;
  isActive?: boolean;
}
