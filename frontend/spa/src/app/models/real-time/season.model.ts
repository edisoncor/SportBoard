import { Team } from './team.model';
import { MatchPhase } from './match-phase.model';

export interface Season {
    id: number;
    start_date: Date | string;
    end_date: Date | string;
    competition_id: number;
    competition: string;
    current_phase_int: number;
    current_phase: MatchPhase | string;
    total_rounds?: number;
    teams?: Team[];
  }