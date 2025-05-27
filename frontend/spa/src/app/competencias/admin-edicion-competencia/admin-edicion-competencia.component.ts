import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectionList } from '@angular/material/list';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { CompetenceService } from '../../services/competencies/competence.service';
import { CompetenceEditionService } from '../../services/competencies/competence-edition.service';
import { UserService } from '../../services/competencies/user.service';
import { StageService } from '../../services/competencies/stage.service';
import { RegistrationService } from '../../services/competencies/registration.service';
import { Competence } from '../../models/competencies/competence.model';
import { CompetitionEdition } from '../../models/competencies/competence-edition.model';
import { User } from '../../models/competencies/user.model';
import { Stage } from '../../models/competencies/stage.model';
import { Registration } from '../../models/competencies/registration.model';
import { Planning } from '../../models/competencies/planning.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CompetitionEditionPayload } from '../../models/competencies/edition-payload.model';
import { PlanningService } from '../../services/competencies/planning.service';
import { BreadcrumbCompetenciasComponent } from '../breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-edicion-competencia',
  standalone: true,
  imports: [
    SharedModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    BreadcrumbCompetenciasComponent,
  ],
  providers: [
    provideNativeDateAdapter()  // Agregar este proveedor
  ],
  templateUrl: './admin-edicion-competencia.component.html',
  styleUrls: ['./admin-edicion-competencia.component.scss']
})
export class AdminEdicionCompetenciaComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('registrationList') registrationList!: MatSelectionList;
  
  dataSource!: MatTableDataSource<CompetitionEdition>;
  displayedColumns: string[] = ['competence', 'admin', 'start_date', 'end_date', 'stages_count', 'registrations_count'];
  
  form: FormGroup;
  competences: Competence[] = [];
  admins: User[] = [];
  availableRegistrations: Registration[] = [];
  selectedRegistrations: Registration[] = [];
  stages: Stage[] = [];
  editions: CompetitionEdition[] = [];
  
  isLoading = false;
  selectedEdition: CompetitionEdition | null = null;
  isDeleteMode = false;
  searchText = '';
  currentRoute: string = '';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private competenceService: CompetenceService,
    private competenceEditionService: CompetenceEditionService,
    private userService: UserService,
    private stageService: StageService,
    private registrationService: RegistrationService,
    private planningService: PlanningService, // Agregar el servicio
    private router: Router
  ) {
    this.form = this.fb.group({
      competence: ['', Validators.required],
      competence_admin: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      stage_start_date: [''],
      stage_end_date: ['']
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadCompetences();
    this.loadAdmins();
    this.loadEditions();
    this.loadAvailableRegistrations();
  }

  loadCompetences(): void {
    this.isLoading = true;
    this.competenceService.getCompetences().subscribe({
      next: (data) => this.competences = data,
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadAdmins(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.admins = users.filter(user => user.role === 'Coach'), // Cambiado de 'Admin' a 'Coach'
      error: (error) => this.handleError(error)
    });
  }

  loadEditions(): void {
    this.isLoading = true;
    this.competenceEditionService.getCompetenceEditions().subscribe({
      next: (data) => {
        this.editions = data;
        this.dataSource = new MatTableDataSource(this.editions);
        this.dataSource.sort = this.sort;
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadAvailableRegistrations(): void {
    this.registrationService.getRegistrations().subscribe({
      next: (registrations) => {
        this.availableRegistrations = registrations;
        if (this.selectedEdition) {
          this.updateSelectionLists();
        }
      },
      error: (error) => this.handleError(error)
    });
  }

  addStage(): void {
    const stageForm = this.form.value;
    if (stageForm.stage_start_date && stageForm.stage_end_date) {
      const stagePlanning: Planning = {
        id: 0,
        start_date: stageForm.stage_start_date,
        end_date: stageForm.stage_end_date
      };

      const newStage: Stage = {
        id: 0,
        time: stagePlanning
      };

      this.stages.push(newStage);
      
      // Limpiar campos del formulario de etapa
      this.form.patchValue({
        stage_start_date: '',
        stage_end_date: ''
      });
    }
  }

  removeStage(stage: Stage): void {
    const index = this.stages.indexOf(stage);
    if (index >= 0) {
      this.stages.splice(index, 1);
    }
  }

  toggleRegistrationSelection(registration: Registration): void {
    if (!registration) return;  // Agregar verificación

    const index = this.selectedRegistrations.findIndex(r => r && r.id === registration.id);
    if (index === -1) {
      this.selectedRegistrations.push(registration);
    } else {
      this.selectedRegistrations.splice(index, 1);
    }

    // Actualizar la vista inmediatamente
    if (this.registrationList) {
      const option = this.registrationList.options.find(
        opt => opt && opt.value && opt.value.id === registration.id
      );
      if (option) {
        option.selected = index === -1;
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const formData = this.form.value;
      
      const planning: Planning = {
        id: 0,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      const editionData: CompetitionEditionPayload = {
        id: this.selectedEdition ? this.selectedEdition.id : 0,
        competence: formData.competence,
        competence_admin: formData.competence_admin,
        planning: planning,
        inscription_list: this.selectedRegistrations.map(reg => reg.id),
        stage_list: this.stages,
        subdivision_list: []
      };

      const operation = this.selectedEdition
        ? this.competenceEditionService.updateCompetenceEdition(this.selectedEdition.id, editionData)
        : this.competenceEditionService.createCompetenceEdition(editionData);

      operation.subscribe({
        next: () => {
          this.openFlashMessage(
            `Edición de competencia ${this.selectedEdition ? 'actualizada' : 'creada'} exitosamente`,
            'success'
          );
          this.loadEditions();
          this.resetForm();
        },
        error: (error) => this.handleError(error),
        complete: () => this.isLoading = false
      });
    } else {
      this.markFormGroupTouched(this.form);
      this.openFlashMessage('Por favor complete todos los campos requeridos', 'warning');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.form.reset();
    this.form.enable();
    this.stages = [];
    this.selectedRegistrations = [];
    this.selectedEdition = null;
    this.isDeleteMode = false;
    
    if (this.registrationList) {
      this.registrationList.disabled = false;
    }
  }

  private updateSelectionLists(): void {
    if (this.registrationList && this.selectedRegistrations) {
      this.registrationList.options.forEach(option => {
        if (option && option.value) {  // Verificar que option y option.value existen
          const isSelected = this.selectedRegistrations.some(selected => 
            selected && selected.id === option.value.id
          );
          option.selected = isSelected;
        }
      });
    }
  }

  // Agregar método helper para verificar si time es un Planning
  isPlanning(time: any): time is Planning {
    return time && typeof time === 'object' && 'start_date' in time && 'end_date' in time;
  }

  onSelect(edition: CompetitionEdition): void {
    if (!edition) return;

    this.selectedEdition = edition;
    this.isDeleteMode = false;
    
    // Cargar datos básicos en el formulario
    this.form.patchValue({
      competence: edition.competence?.id,
      competence_admin: edition.competence_admin?.id,
      start_date: edition.planning?.start_date ? new Date(edition.planning.start_date) : null,
      end_date: edition.planning?.end_date ? new Date(edition.planning.end_date) : null
    });

    // Actualizar stages asegurando que time sea siempre un objeto Planning
    if (edition.stage_list && edition.stage_list.length > 0) {
      const stagePromises = edition.stage_list.map(async stageInfo => {
        if (!stageInfo?.id) return null;
        try {
          const stage = await this.stageService.getStage(stageInfo.id).toPromise();
          if (stage && !this.isPlanning(stage.time)) {
            // Si time no es un objeto Planning, obtenerlo del servidor
            const timeId = typeof stage.time === 'number' ? stage.time : null;
            if (timeId) {
              const planning = await this.planningService.getPlanning(timeId).toPromise();
              return {
                id: stage.id,
                time: planning
              };
            }
          }
          return stage;
        } catch (error) {
          console.error('Error loading stage:', error);
          return null;
        }
      });

      Promise.all(stagePromises)
        .then(stages => {
          this.stages = stages
            .filter((stage): stage is Stage => 
              stage !== null && stage !== undefined && stage.time !== undefined && this.isPlanning(stage.time)
            )
            .map(stage => ({
              id: stage.id,
              time: {
                id: stage.time.id,
                start_date: new Date(stage.time.start_date),
                end_date: new Date(stage.time.end_date)
              }
            }));
        })
        .catch(error => this.handleError(error));
    } else {
      this.stages = [];
    }

    // Actualizar inscripciones seleccionadas
    if (this.availableRegistrations && edition.inscription_list) {
      this.selectedRegistrations = this.availableRegistrations.filter(reg => 
        reg && edition.inscription_list?.some(inscr => inscr?.id === reg.id)
      );
    } else {
      this.selectedRegistrations = [];
    }
    
    // Actualizar las selecciones en la lista
    setTimeout(() => {
      this.updateSelectionLists();
    });
  }

  delete(): void {
    if (this.selectedEdition) {
      this.isDeleteMode = true;
      this.form.disable();
      
      if (this.registrationList) {
        this.registrationList.disabled = true;
      }
    }
  }

  confirmDelete(): void {
    if (this.selectedEdition) {
      this.competenceEditionService.deleteCompetenceEdition(this.selectedEdition.id).subscribe({
        next: () => {
          this.openFlashMessage('Edición eliminada exitosamente', 'success');
          this.loadEditions();
          this.resetForm();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleError(error: any): void {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    this.openFlashMessage(errorMessage, 'error');
  }

  private openFlashMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const dialogRef = this.dialog.open(FlashMessageComponent, {
      width: '400px',
      data: { message, type, duration: 3000, position: 'top-right' }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filterPredicate = (data: CompetitionEdition, filter: string) => {
      return data.competence.name.toLowerCase().includes(filter) ||
             data.competence_admin.firstname.toLowerCase().includes(filter) ||
             data.competence_admin.lastname.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'competence':
          return this.compare(a.competence.name, b.competence.name, isAsc);
        case 'admin':
          return this.compare(
            `${a.competence_admin.firstname} ${a.competence_admin.lastname}`,
            `${b.competence_admin.firstname} ${b.competence_admin.lastname}`,
            isAsc
          );
        case 'start_date':
          return this.compare(a.planning.start_date.toString(), b.planning.start_date.toString(), isAsc);
        case 'end_date':
          return this.compare(a.planning.end_date.toString(), b.planning.end_date.toString(), isAsc);
        case 'stages_count':
          return this.compare(a.stage_list.length, b.stage_list.length, isAsc);
        case 'registrations_count':
          return this.compare(a.inscription_list.length, b.inscription_list.length, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
