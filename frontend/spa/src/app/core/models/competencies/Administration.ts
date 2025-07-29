/**
 * Modelo para la entidad Administration del microservicio de competencias
 */

export interface Administration {
  id?: number;
  name: string;
  phone: string;
  city: string;
  province: string;
  country: string;
  location: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdministrationDto {
  name: string;
  phone: string;
  city: string;
  province: string;
  country: string;
  location: string;
  isActive?: boolean;
}

export interface UpdateAdministrationDto {
  name?: string;
  phone?: string;
  city?: string;
  province?: string;
  country?: string;
  location?: string;
  isActive?: boolean;
}
