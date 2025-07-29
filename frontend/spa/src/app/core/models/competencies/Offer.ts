/**
 * Modelo para la entidad Offer del microservicio de competencias
 */

import { Phase } from './Phase';

export interface Offer {
  id?: number;
  name: string;
  description: string;
  creationDate: Date;
  isStatic: boolean;
  phase: number | Phase;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOfferDto {
  name: string;
  description: string;
  isStatic?: boolean;
  phase: number;
}

export interface UpdateOfferDto {
  name?: string;
  description?: string;
  isStatic?: boolean;
  phase?: number;
}
