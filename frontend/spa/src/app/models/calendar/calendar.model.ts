import { Competition } from './competition.model';

export interface Calendar {
    id: number;
    competition: Competition;
    startDate: Date;
    endDate: Date;
}