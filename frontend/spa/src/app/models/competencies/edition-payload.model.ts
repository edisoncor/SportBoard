import { Planning } from './planning.model';
import { Stage } from './stage.model';

export interface CompetitionEditionPayload {
    id: number;
    competence: number;
    competence_admin: number;
    planning: Planning;
    inscription_list: number[];
    stage_list: Stage[];
    subdivision_list: number[];
}
