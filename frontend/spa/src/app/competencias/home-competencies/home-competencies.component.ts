import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-competencies',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home-competencies.component.html',
  styleUrls: ['./home-competencies.component.scss']
})
export class HomeCompetenciesComponent {
  models = [
    { title: 'User', description: 'Modelo de usuario', icon: 'person', route: 'admin-users' },
    { title: 'Team', description: 'Modelo de equipo', icon: 'group', route: 'admin-equipos' },
    { title: 'Squad', description: 'Modelo de escuadra', icon: 'sports_soccer', route: 'admin-squad' },
    //{ title: 'PlayerAssignment', description: 'Asignación de jugador', icon: 'assignment_ind' },
    //{ title: 'CoachAssignment', description: 'Asignación de entrenador', icon: 'assignment' },
    { title: 'Registration', description: 'Modelo de registro', icon: 'how_to_reg', route: 'admin-registrations' },
    { title: 'Rule', description: 'Modelo de regla', icon: 'gavel', route: 'admin-rules' },
    { title: 'Discipline', description: 'Modelo de disciplina', icon: 'fitness_center', route: 'admin-discipline' },
    { title: 'RuleDiscipline', description: 'Regla de disciplina', icon: 'rule', route: 'admin-rules-discipline' },
    { title: 'CompetitionEdition', description: 'Edición de competencia', icon: 'emoji_events', route: 'admin-edition-competence' },  
    //{ title: 'Stage', description: 'Modelo de etapa', icon: 'flag' },
    { title: 'Competence', description: 'Modelo de competencia', icon: 'emoji_events', route: 'admin-competence' },
    { title: 'Format', description: 'Modelo de formato', icon: 'format_shapes', route: 'admin-formats' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string | undefined): void {
    if (route) {
      this.router.navigate(['/competencias', route]);
    }
  }
}
