import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompetenciasRoutingModule } from './competencias-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CompetenceService } from '../services/competencies/competence.service';
import { TitleCasePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeCompetenciesComponent } from './home-competencies/home-competencies.component';
import { AdminCompetenciasComponent } from './admin-competencias/admin-competencias.component';
import { AdminDisciplinasComponent } from './admin-disciplinas/admin-disciplinas.component';
import { DisciplineService } from '../services/competencies/discipline.service';
import { AdminRuleCompetenceComponent } from './admin-rule-competence/admin-rule-competence.component';
import { RuleCompetenceService } from '../services/competencies/rule-competence.service';
import { RuleDisciplineService } from '../services/competencies/rule-discipline.service';
import { AdminFormatsComponent } from './admin-formats/admin-formats.component';
import { FormatService } from '../services/competencies/format.service';
import { AdminEquiposComponent } from './admin-equipos/admin-equipos.component';
import { TeamService } from '../services/competencies/team.service';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { UserService } from '../services/competencies/user.service';
import { AdminSquadComponent } from './admin-squad/admin-squad.component';
import { SquadService } from '../services/competencies/squad.service';
import { AdminRegistrosComponent } from './admin-registros/admin-registros.component';
import { RegistrationService } from '../services/competencies/registration.service';
import { AdminEdicionCompetenciaComponent } from './admin-edicion-competencia/admin-edicion-competencia.component';
import { CompetenceEditionService } from '../services/competencies/competence-edition.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompetenciasRoutingModule,
    SharedModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    DragDropModule,
    HomeCompetenciesComponent,
    AdminCompetenciasComponent,
    AdminDisciplinasComponent,
    AdminRuleCompetenceComponent,
    AdminFormatsComponent,
    AdminEquiposComponent,
    AdminUsersComponent,
    AdminSquadComponent,
    AdminRegistrosComponent,
    AdminEdicionCompetenciaComponent,
  ],
  providers: [
    CompetenceService,
    DisciplineService,
    RuleCompetenceService,
    RuleDisciplineService,
    FormatService,
    TeamService,
    UserService,
    SquadService,
    RegistrationService,
    CompetenceEditionService,
    TitleCasePipe], 
})
export class CompetenciasModule { }