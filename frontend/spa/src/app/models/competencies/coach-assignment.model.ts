import { Squad } from './squad.model';
import { User } from './user.model';

export interface CoachAssignment {
    squad: Squad;
    coach: User;
}