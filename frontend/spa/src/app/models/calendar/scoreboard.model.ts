import { Team } from './team.model';

export interface Scoreboard {
    id: number;
    homeScore: number;
    guestScore: number;
    isFinished: boolean;
    winner: Team | null;
}