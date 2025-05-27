import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormatService } from '../../services/competencies/format.service';
import { Format } from '../../models/competencies/format.model';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreadcrumbCompetenciasComponent } from '../breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-formats',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    BreadcrumbCompetenciasComponent
  ],
  templateUrl: './admin-formats.component.html',
  styleUrls: ['./admin-formats.component.scss']
})
export class AdminFormatsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<Format>;
  searchText: string = '';
  formats: Format[] = [];
  displayedColumns: string[] = ['name', 'description'];
  selectedFormat: Format | null = null;
  form: FormGroup;
  isDeleteMode: boolean = false;
  isLoading: boolean = false;
  currentRoute: string = '';

  constructor(
    private formatService: FormatService, 
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
      ]]
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadFormats();
  }

  loadFormats(): void {
    this.isLoading = true;
    this.formatService.getFormats().subscribe({
      next: (data) => {
        this.formats = data;
        this.dataSource = new MatTableDataSource(this.formats);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Format, filter: string) => {
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
    this.loadFormats();
  }

  create(): void {
    this.selectedFormat = null;
    this.form.enable();
    this.form.reset();
    this.isDeleteMode = false;
  }

  delete(): void {
    this.isDeleteMode = true;
    this.form.disable();
  }

  confirmDelete(): void {
    if (this.selectedFormat) {
      this.formatService.deleteFormat(this.selectedFormat.id).subscribe({
        next: () => {
          this.openFlashMessage('Formato eliminado exitosamente', 'success');
          this.loadFormats();
          this.onCancel();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onSelect(format: Format): void {
    this.selectedFormat = format;
    this.form.enable();
    this.form.patchValue({
      name: format.name,
      description: format.description
    });
    this.isDeleteMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formatData = this.form.value;

      if (this.selectedFormat) {
        this.formatService.updateFormat(this.selectedFormat.id, formatData).subscribe({
          next: () => {
            this.openFlashMessage('Formato actualizado exitosamente', 'success');
            this.loadFormats();
            this.onCancel();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        this.formatService.createFormat(formatData).subscribe({
          next: () => {
            this.openFlashMessage('Formato creado exitosamente', 'success');
            this.loadFormats();
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

  onCancel(): void {
    this.form.enable();
    this.form.reset();
    this.selectedFormat = null;
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
