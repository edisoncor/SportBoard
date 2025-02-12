import { Team } from './team.model';

export interface Leaderboard {
    id: number;
    team: Team;
    points: number;
    position: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    matchesTied: number;
}