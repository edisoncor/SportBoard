export interface TeamStatistic {
    id: number;
    team_id: number;
    season_id?: number;
    matches_played: number;
    wins: number;
    losses: number;
    draws: number;
    goals_scored: number;
    goals_conceded: number;
    goal_difference: number;
    points: number;
  }