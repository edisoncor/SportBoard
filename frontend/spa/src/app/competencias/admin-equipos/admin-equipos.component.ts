import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from '../../services/competencies/team.service';
import { Team } from '../../models/competencies/team.model';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CatalogService } from '../../services/catalogs/catalog.service';
import { Catalog } from '../../models/catalogs/catalog.model';
import { BreadcrumbCompetenciasComponent } from '../../competencias/breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-equipos',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    BreadcrumbCompetenciasComponent,
  ],
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.scss']
})
export class AdminEquiposComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Team>;
  searchText: string = '';
  teams: Team[] = [];
  displayedColumns: string[] = ['logo', 'name', 'country'];
  selectedTeam: Team | null = null;
  form: FormGroup;
  fileName: string | null = null;
  fileIcon: string = 'insert_drive_file';
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  filePreview: string | null = null;
  isLoading: boolean = false;
  countries: Catalog[] = [];
  currentRoute: string = '';

  constructor(
    private teamService: TeamService, 
    private dialog: MatDialog, 
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      country: ['', [Validators.required]],
      logo: [null, Validators.required],
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadCountries();
  }

  loadTeams(): void {
    this.isLoading = true;
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.dataSource = new MatTableDataSource(this.teams);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Team, filter: string) => {
          return data.name.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadCountries(): void {
    this.catalogService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => this.handleError(error)
    });
  }

  refresh(): void {
    this.searchText = '';
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
    this.loadTeams();
  }

  create(): void {
    this.selectedTeam = null;
    this.form.enable();
    this.form.reset();
    this.fileName = null;
    this.fileIcon = 'insert_drive_file';
    this.filePreview = null;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  delete(): void {
    this.isDeleteMode = true;
    this.form.disable();
  }

  confirmDelete(): void {
    if (this.selectedTeam) {
      this.teamService.deleteTeam(this.selectedTeam.id).subscribe({
        next: () => {
          this.openFlashMessage('Equipo eliminado exitosamente', 'success');
          this.loadTeams();
          this.onCancel();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onSelect(team: Team): void {
    this.selectedTeam = team;
    this.form.enable();
    this.form.patchValue({
      name: team.name,
      country: team.country, // Ahora country es un string
      logo: team.logo,
    });
    this.fileName = team.logo;
    this.filePreview = team.logo;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('country', this.form.get('country')?.value);

      const logoFile = this.form.get('logo')?.value;
      if (logoFile instanceof File) {
        formData.append('logo', logoFile);
      }

      if (this.selectedTeam) {
        this.teamService.updateTeam(this.selectedTeam.id, formData).subscribe({
          next: () => {
            this.openFlashMessage('Equipo actualizado exitosamente', 'success');
            this.loadTeams();
            this.onCancel();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        this.teamService.createTeam(formData).subscribe({
          next: () => {
            this.openFlashMessage('Equipo creado exitosamente', 'success');
            this.loadTeams();
            this.onCancel();
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

  private formatFileName(name: string): string {
    if (name.length > 25) {
      const extension = name.split('.').pop();
      return name.substring(0, 20) + '...' + (extension ? '.' + extension : '');
    }
    return name;
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({ logo: file });
      this.fileName = this.formatFileName(file.name);
      this.fileIcon = this.getFileIcon(file.type);
      this.filePreview = URL.createObjectURL(file);
      this.isEditMode = false;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.form.patchValue({ logo: file });
      this.fileName = this.formatFileName(file.name);
      this.fileIcon = this.getFileIcon(file.type);
      this.filePreview = URL.createObjectURL(file);
      this.isEditMode = false;
    }
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) {
      return 'image';
    }
    return 'insert_drive_file';
  }

  removeFile(event: MouseEvent): void {
    event.stopPropagation();
    this.form.patchValue({ logo: null });
    this.fileName = null;
    this.fileIcon = 'insert_drive_file';
    this.filePreview = null;
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  onCancel(): void {
    this.form.enable();
    this.form.reset();
    this.selectedTeam = null;
    this.fileName = null;
    this.fileIcon = 'insert_drive_file';
    this.filePreview = null;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
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

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'country':
          return this.compare(a.country, b.country, isAsc); // Ahora country es un string
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}
