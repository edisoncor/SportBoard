import { Team } from './team.model';
import { Event } from './event.model';
import { MatchStatus } from './match-status.model';
import { Season } from './season.model';
import { Competition } from './competition.model';


export interface Match {
    id: number;
    status: MatchStatus | string;
    home_team_id: number;
    away_team_id: number;
    season_id?: number;
    season? : Season
    home_team?: Team;
    away_team?: Team;
    date: Date | string;
    goals_home: number;
    goals_away: number;
    events?: Event[];
}

export interface MatchesByDayResponse {
  competition: Competition;
  season: Season;
  matches: Match[];
}