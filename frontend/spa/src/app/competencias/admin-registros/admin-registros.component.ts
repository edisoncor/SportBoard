import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationService } from '../../services/competencies/registration.service';
import { SquadService } from '../../services/competencies/squad.service';
import { Registration } from '../../models/competencies/registration.model';
import { Squad } from '../../models/competencies/squad.model';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegistrationDTO } from '../../models/competencies/registration-dto.model';
import { BreadcrumbCompetenciasComponent } from '../breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-registros',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    BreadcrumbCompetenciasComponent,
  ],
  templateUrl: './admin-registros.component.html',
  styleUrls: ['./admin-registros.component.scss']
})
export class AdminRegistrosComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Registration>;
  searchText: string = '';
  registrations: Registration[] = [];
  squads: Squad[] = [];
  displayedColumns: string[] = ['squad', 'serie'];
  selectedRegistration: Registration | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  isLoading: boolean = false;
  currentRoute: string = '';

  constructor(
    private registrationService: RegistrationService,
    private squadService: SquadService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      squad: ['', [Validators.required]],
      serie: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]]
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadRegistrations();
    this.loadSquads();
  }

  loadRegistrations(): void {
    this.isLoading = true;
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.dataSource = new MatTableDataSource(this.registrations);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Registration, filter: string) => {
          return data.squad.team.name.toLowerCase().includes(filter.toLowerCase()) ||
                 data.serie.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadSquads(): void {
    this.squadService.getSquads().subscribe({
      next: (data) => {
        this.squads = data;
      },
      error: (error) => this.handleError(error)
    });
  }

  refresh(): void {
    this.searchText = '';
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
    this.loadRegistrations();
  }

  create(): void {
    this.selectedRegistration = null;
    this.form.enable();
    this.form.reset();
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  delete(): void {
    this.isDeleteMode = true;
    this.form.disable();
  }

  confirmDelete(): void {
    if (this.selectedRegistration) {
      this.registrationService.deleteRegistration(this.selectedRegistration.id).subscribe({
        next: () => {
          this.openFlashMessage('Registro eliminado exitosamente', 'success');
          this.loadRegistrations();
          this.onCancel();
          this.updateSquadRegistrations(this.selectedRegistration!.squad.id);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onSelect(registration: Registration): void {
    this.selectedRegistration = registration;
    this.form.enable();
    this.form.patchValue({
      squad: registration.squad.id,
      serie: registration.serie
    });
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const registrationData: RegistrationDTO = {
        squad: this.form.get('squad')?.value,
        serie: this.form.get('serie')?.value,
        competencie: null
      };

      if (this.selectedRegistration) {
        this.registrationService.updateRegistration(this.selectedRegistration.id, registrationData).subscribe({
          next: () => {
            this.openFlashMessage('Registro actualizado exitosamente', 'success');
            this.loadRegistrations();
            this.onCancel();
            this.updateSquadRegistrations(registrationData.squad);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        this.registrationService.createRegistration(registrationData).subscribe({
          next: () => {
            this.openFlashMessage('Registro creado exitosamente', 'success');
            this.loadRegistrations();
            this.onCancel();
            this.updateSquadRegistrations(registrationData.squad);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.form);
      this.openFlashMessage('Por favor, complete todos los campos requeridos correctamente', 'warning');
    }
  }

  private updateSquadRegistrations(squadId: number): void {
    this.squadService.getSquad(squadId).subscribe({
      next: (updatedSquad) => {
        const index = this.squads.findIndex(s => s.id === squadId);
        if (index !== -1) {
          this.squads[index] = updatedSquad;
        }
      },
      error: (error) => this.handleError(error)
    });
  }

  onCancel(): void {
    this.form.enable();
    this.form.reset();
    this.selectedRegistration = null;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  private openFlashMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    const dialogRef = this.dialog.open(FlashMessageComponent, {
      width: '400px',
      data: {
        message,
        type,
        duration: 3000,
        position: 'top-right'
      }
    });

    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'squad':
          return this.compare(a.squad.team.name, b.squad.team.name, isAsc);
        case 'serie':
          return this.compare(a.serie, b.serie, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private handleError(error: any): void {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para realizar esta acción';
    }
    this.openFlashMessage(errorMessage, 'error');
  }
}
