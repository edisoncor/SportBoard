import { Match } from './match.model';

export interface Round {
    id: number;
    number: number;
    matches: Match[];
}