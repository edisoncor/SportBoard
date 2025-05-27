import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisciplineService } from '../../services/competencies/discipline.service';
import { Discipline } from '../../models/competencies/discipline.model';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreadcrumbCompetenciasComponent } from '../breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-disciplinas',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    BreadcrumbCompetenciasComponent
  ],
  templateUrl: './admin-disciplinas.component.html',
  styleUrls: ['./admin-disciplinas.component.scss']
})
export class AdminDisciplinasComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Discipline>;
  searchText: string = '';
  disciplines: Discipline[] = [];
  displayedColumns: string[] = ['image', 'name', 'surface', 'federation', 'description'];
  selectedDiscipline: Discipline | null = null;
  form: FormGroup;
  fileName: string | null = null;
  fileIcon: string = 'insert_drive_file';
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  filePreview: string | null = null;
  isLoading: boolean = false;
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  maxFileSize = 5 * 1024 * 1024; // 5MB
  currentRoute: string = '';

  constructor(
    private disciplineService: DisciplineService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [{value: '', disabled: false}, [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s\-_]+$/)
      ]],
      description: [{value: '', disabled: false}, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      surface: [{value: '', disabled: false}, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      federation: [{value: '', disabled: false}, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      image: [{value: null, disabled: false}, [
        Validators.required,
        this.fileTypeValidator(),
        this.fileSizeValidator()
      ]],
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadDisciplines();
  }

  loadDisciplines(): void {
    this.isLoading = true;
    this.disciplineService.getDisciplines().subscribe({
      next: (data) => {
        this.disciplines = data;
        this.dataSource = new MatTableDataSource(this.disciplines);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Discipline, filter: string) => {
          return data.name.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  refresh(): void {
    this.searchText = '';
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
    this.loadDisciplines();
  }

  create(): void {
    this.selectedDiscipline = null;
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
    if (this.selectedDiscipline) {
      this.disciplineService.deleteDiscipline(this.selectedDiscipline.id).subscribe({
        next: () => {
          this.openFlashMessage('Disciplina eliminada exitosamente', 'success');
          this.loadDisciplines();
          this.onCancel();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onSelect(discipline: Discipline): void {
    this.selectedDiscipline = discipline;
    this.form.enable();
    this.form.patchValue({
      name: discipline.name,
      description: discipline.description,
      surface: discipline.surface,
      federation: discipline.federation,
      image: discipline.image,
    });
    this.fileName = discipline.image;
    this.filePreview = discipline.image;
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('surface', this.form.get('surface')?.value);
      formData.append('federation', this.form.get('federation')?.value);

      const imageFile = this.form.get('image')?.value;
      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }

      if (this.selectedDiscipline) {
        this.disciplineService.updateDiscipline(this.selectedDiscipline.id, formData).subscribe({
          next: () => {
            this.openFlashMessage('Disciplina actualizada exitosamente', 'success');
            this.loadDisciplines();
            this.onCancel();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        this.disciplineService.createDiscipline(formData).subscribe({
          next: () => {
            this.openFlashMessage('Disciplina creada exitosamente', 'success');
            this.loadDisciplines();
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
      this.form.patchValue({ image: file });
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
      this.form.patchValue({ image: file });
      this.fileName = this.formatFileName(file.name);
      this.fileIcon = this.getFileIcon(file.type);
      this.filePreview = URL.createObjectURL(file);
      this.isEditMode = false;
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
    this.form.patchValue({ image: null });
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
    this.selectedDiscipline = null;
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
        case 'surface':
          return this.compare(a.surface, b.surface, isAsc);
        case 'federation':
          return this.compare(a.federation, b.federation, isAsc);
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
