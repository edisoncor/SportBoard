/**
 * Modelo para la entidad User del microservicio de competencias
 */

export interface User {
  id?: number;
  city: number;
  country: number;
  email: string;
  first_name: string;
  last_name: string;
  location: number;
  is_active: boolean;
  phone: string;
  province: number;
  password?: string;
}

export interface CreateUserDto {
  city: number;
  country: number;
  email: string;
  first_name: string;
  last_name: string;
  location: number;
  phone: string;
  province: number;
  password: string;
  is_active?: boolean;
}

export interface UpdateUserDto {
  city?: number;
  country?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  location?: number;
  phone?: string;
  province?: number;
  is_active?: boolean;
}

// Mantenemos los tipos anteriores para retrocompatibilidad
export interface CompetencyUser extends User {}
export interface CreateCompetencyUserDto extends CreateUserDto {}
export interface UpdateCompetencyUserDto extends UpdateUserDto {}
