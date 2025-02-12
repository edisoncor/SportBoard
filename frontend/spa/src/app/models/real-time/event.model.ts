import { EventType } from './event-type.model';
import { Player } from './player.model';
import { Team } from './team.model';

export interface Event {
    id: number;
    match_id: number;
    team_id?: number;
    player_id?: number;
    related_player_id?: number;
    event_type: EventType | string;
    minute: number;
    // Relaciones (opcional, si vienen en la respuesta)
    team?: Team;
    player?: Player;
    related_player?: Player;
  }