import { Player } from "./player.model";

export interface PlayerStatistic {
    id: number;
    //player_id: number;
    player_id: Player;
    season_id: number;
    goals: number;
    assists: number;
    minutes_played: number;
    fouls: number;
    yellow_cards: number;
    red_cards: number;
  }