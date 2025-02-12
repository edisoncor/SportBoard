export interface TeamMatchStatistic {
    id: number;
    team_id: number;
    match_id: number;
    shots: number;
    shots_to_goal: number;
    possession: number;
    passes: number;
    fouls: number;
    yellow_cards: number;
    red_cards: number; 
    offsides: number;
    corners: number;
  }