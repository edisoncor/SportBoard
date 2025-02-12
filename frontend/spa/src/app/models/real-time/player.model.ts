import { Team } from './team.model';
import { Position } from './position.model';

export interface Player {
    id: number;
    name: string;
    position: Position | string;
    photo?: string;
    historical_teams?: Team[];
    current_team_id?: number;
    current_team?: Team;
  }