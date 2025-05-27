import { RuleCompetition } from './rule-competence.model';
import { RuleDiscipline } from './rule-discipline.model';
import { Format } from './format.model';
import { Discipline } from './discipline.model';

export interface Competence {
    id: number;
    name: string;
    description: string;
    logo: string;
    competence_format?: Format;
    rule_discipline_list?: RuleDiscipline[];
    rule_list?: RuleCompetition[];
    discipline: Discipline;
}
