import { Rule } from './rule.model';
import { Discipline } from './discipline.model';

export interface RuleDiscipline extends Rule {
    discipline: Discipline;
}