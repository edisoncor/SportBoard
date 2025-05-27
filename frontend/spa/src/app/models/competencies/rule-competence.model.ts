import { Rule } from './rule.model';
import { Competence } from './competence.model';

export interface RuleCompetition extends Rule {
    competence: Competence;
}