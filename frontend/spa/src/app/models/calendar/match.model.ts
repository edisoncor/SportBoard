import { Team } from './team.model';
import { PlayingField } from './playing-field.model';
import { Scoreboard } from './scoreboard.model';

export interface Match {
    id: number;
    date: Date;
    startTime: string;
    homeTeam: Team;
    guestTeam: Team;
    duration: number;
    finishTime: string;
    scoreboard: Scoreboard;
    playingField: PlayingField;
    status: 'PENDING' | 'FINALIZED' | 'IN_PROGRESS' | 'SUSPENDED';
}