import { TeamMatchStatistic } from './team-match-statistic.model';

export interface MatchStatistic {
    id: number;
    match_id: number;
    home_team_stats_id: number;
    away_team_stats_id: number;
    home_team_stats?: TeamMatchStatistic;
    away_team_stats?: TeamMatchStatistic;
  }