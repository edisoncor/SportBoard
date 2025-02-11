import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompetenceService } from '../../services/competencies/competence.service';
import { Competence } from '../../models/competencies/competence.model';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DisciplineService } from '../../services/competencies/discipline.service';
import { Discipline } from '../../models/competencies/discipline.model';
import { FormatService } from '../../services/competencies/format.service';
import { Format } from '../../models/competencies/format.model';
import { BreadcrumbCompetenciasComponent } from '../breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-competencias',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    BreadcrumbCompetenciasComponent
  ],
  templateUrl: './admin-competencias.component.html',
  styleUrls: ['./admin-competencias.component.scss']
})
export class AdminCompetenciasComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Competence>;
  searchText: string = '';
  competences: Competence[] = [];
  displayedColumns: string[] = ['logo', 'name', 'description']; // Modificado para mostrar solo estas columnas
  selectedCompetence: Competence | null = null;
  form: FormGroup;
  fileName: string | null = null;
  fileIcon: string = 'insert_drive_file';
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  filePreview: string | null = null;
  isLoading: boolean = false;
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  maxFileSize = 5 * 1024 * 1024; // 5MB
  disciplines: Discipline[] = [];
  formats: Format[] = []; // Añadir esta propiedad
  currentRoute: string = '';

  constructor(
    private competenceService: CompetenceService,
    private disciplineService: DisciplineService, // Añadir DisciplineService
    private formatService: FormatService, // Añadir FormatService
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: new FormControl({value: '', disabled: false}, [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s\-_]+$/)
      ]),
      description: new FormControl({value: '', disabled: false}, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]),
      discipline: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      competence_format: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      logo: new FormControl({value: null, disabled: false}, [
        Validators.required,
        this.fileTypeValidator(),
        this.fileSizeValidator()
      ])
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadDisciplines(); // Cargar disciplinas al inicio
    this.loadFormats(); // Añadir carga de formatos
    this.loadCompetences();
  }

  loadCompetences(): void {
    this.isLoading = true;
    this.competenceService.getCompetences().subscribe({
      next: (data) => {
        this.competences = data;
        this.dataSource = new MatTableDataSource(this.competences);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Competence, filter: string) => {
          return data.name.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadDisciplines(): void {
    this.isLoading = true;
    this.disciplineService.getDisciplines().subscribe({
      next: (data) => {
        this.disciplines = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  loadFormats(): void {
    this.formatService.getFormats().subscribe({
      next: (data) => {
        this.formats = data;
      },
      error: (error) => this.handleError(error)
    });
  }

  refresh(): void {
    this.searchText = '';
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
    this.loadCompetences();
  }

  create(): void {
    this.selectedCompetence = null;
    this.form.enable(); // Usar el método enable() del FormGroup
    this.form.reset();
    this.fileName = null;
    this.fileIcon = 'insert_drive_file';
    this.filePreview = null;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  delete(): void {
    this.isDeleteMode = true;
    this.isEditMode = false;
    this.form.disable(); // Usar el método disable() del FormGroup
  }

  confirmDelete(): void {
    if (this.selectedCompetence) {
      this.competenceService.deleteCompetence(this.selectedCompetence.id).subscribe({
        next: () => {
          this.openFlashMessage('Competencia eliminada exitosamente', 'success');
          this.loadCompetences();
          this.onCancel();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onSelect(competence: Competence): void {
    this.selectedCompetence = competence;
    this.form.enable();
    this.form.patchValue({
      name: competence.name,
      description: competence.description,
      discipline: competence.discipline.id, // Añadir disciplina al patchValue
      competence_format: competence.competence_format?.id, // Añadir valor del formato
      logo: competence.logo,
      // Otros campos
    });
    this.fileName = competence.logo;
    this.filePreview = competence.logo;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('discipline', this.form.get('discipline')?.value); // Añadir disciplina al FormData

      const formatId = this.form.get('competence_format')?.value;
      if (formatId) {
        formData.append('competence_format', formatId);
      }

      const logoFile = this.form.get('logo')?.value;
      if (logoFile instanceof File) {
        formData.append('logo', logoFile);
      }

      if (this.selectedCompetence) {
        this.competenceService.updateCompetence(this.selectedCompetence.id, formData).subscribe({
          next: () => {
            this.openFlashMessage('Competencia actualizada exitosamente', 'success');
            this.loadCompetences();
            this.onCancel();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        this.competenceService.createCompetence(formData).subscribe({
          next: () => {
            this.openFlashMessage('Competencia creada exitosamente', 'success');
            this.loadCompetences();
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
      this.isEditMode = false; // Desactivar modo edición después de subir nueva imagen
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
      this.isEditMode = false; // Desactivar modo edición después de subir nueva imagen
    }
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) {
      return 'image';
    } else if (fileType.startsWith('video/')) {
      return 'videocam';
    } else if (fileType.startsWith('audio/')) {
      return 'audiotrack';
    } else {
      return 'insert_drive_file';
    }
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
    // No limpiar el filePreview ni fileName aquí
  }

  onCancel(): void {
    this.form.enable(); // Usar el método enable() del FormGroup
    this.form.reset();
    this.selectedCompetence = null;
    this.fileName = null;
    this.fileIcon = 'insert_drive_file';
    this.filePreview = null;
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
      if (control.errors['pattern']) {
        return 'Solo se permiten letras, números, espacios y guiones';
      }
      if (control.errors['invalidFileType']) {
        return 'Solo se permiten archivos de imagen (JPEG, PNG, GIF)';
      }
      if (control.errors['exceedsMaxSize']) {
        return 'El archivo no debe exceder 5MB';
      }
    }
    return '';
  }

  private fileTypeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file instanceof File) {
        if (!this.allowedFileTypes.includes(file.type)) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  private fileSizeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file instanceof File) {
        if (file.size > this.maxFileSize) {
          return { exceedsMaxSize: true };
        }
      }
      return null;
    };
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
        case 'description':
          return this.compare(a.description, b.description, isAsc);
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
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para realizar esta acción';
    }
    this.openFlashMessage(errorMessage, 'error');
  }
}
