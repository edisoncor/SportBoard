import { Team } from './team.model';

export interface Coach {
    id: number;
    name: string;
    start_date: Date | string;
    historical_teams?: Team[];
    current_team_id?: number;
    current_team?: Team;
  }