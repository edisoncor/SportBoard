import { Player } from "./player.model";

export interface PlayerMatchStatistic {
    id: number;
    //player_id: number;
    player_id: Player;
    match_id: number;
    minutes_played: number;
    goals: number;
    assists: number;
    fouls: number;
    yellow_cards: number;
    red_cards: number;
  }