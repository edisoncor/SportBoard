import { Squad } from './squad.model';
import { Locality } from './locality.model';
import { Stage } from './stage.model';

export interface Match {
    home_squad: Squad;
    away_squad: Squad;
    home_goals: number;
    away_goals: number;
    time: Date;
    stadium: Locality;
    stage: Stage;
}