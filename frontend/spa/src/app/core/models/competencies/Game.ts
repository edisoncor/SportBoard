/**
 * Modelo para la entidad Game del microservicio de competencias
 */

import { Team } from './Team';
import { Phase } from './Phase';
import { GameState } from './GameState';

export interface Game {
  id?: number;
  name: string;
  startTime: string;
  endTime: string;
  localTeam: string | Team; // URL or Team object
  visitorTeam: string | Team; // URL or Team object
  phase: string | Phase; // URL or Phase object
  gameState: string | GameState; // URL or GameState object
  localScore?: number;
  visitorScore?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGameDto {
  name: string;
  startTime: string;
  endTime: string;
  localTeam: string; // URL to team
  visitorTeam: string; // URL to team
  phase: string; // URL to phase
  gameState: string; // URL to game state
  localScore?: number;
  visitorScore?: number;
  isActive?: boolean;
}

export interface UpdateGameDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  localTeam?: string;
  visitorTeam?: string;
  phase?: string;
  gameState?: string;
  localScore?: number;
  visitorScore?: number;
  isActive?: boolean;
}
