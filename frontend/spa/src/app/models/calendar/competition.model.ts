import { Team } from './team.model';

export interface Competition {
    id: number;
    name: string;
    description: string;
    teams: Team[];
}