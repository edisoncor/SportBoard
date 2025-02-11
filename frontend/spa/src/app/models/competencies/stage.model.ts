import { Planning } from './planning.model';

export interface Stage {
    id: number;
    time: Planning;  // Cambiado para que solo acepte Planning
}