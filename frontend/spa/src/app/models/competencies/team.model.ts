import { Squad } from './squad.model';

export interface Team {
    id: number;
    name: string;
    country: string;
    logo: string;
    squads?: Squad[];
}