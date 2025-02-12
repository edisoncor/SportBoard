import { Season } from './season.model';
import { CompetitionType } from './competition-type.model';

export interface Competition {
    id: number;
    name: string;
    type: CompetitionType | string;
    team_limit: number;
    seasons?: Season[];

    // Se agrega el campo para identificar temporada actual
    current_season_id: number;
    current_season?: Season;
  }