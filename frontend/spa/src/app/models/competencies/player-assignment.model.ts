import { Squad } from './squad.model';
import { User } from './user.model';

export interface PlayerAssignment {
    squad: Squad;
    player: User;
}