import { Squad } from './squad.model';
import { CompetitionEdition } from './competence-edition.model';

export interface Registration {
    id: number;
    squad: Squad;
    serie: string;
    competencie: CompetitionEdition | null;
}
