import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/competencies/user.service';
import { User } from '../../models/competencies/user.model';
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
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { BreadcrumbCompetenciasComponent } from '../../competencias/breadcrumb-competencias/breadcrumb-competencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    SharedModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    BreadcrumbCompetenciasComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    DatePipe
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<User>;
  searchText: string = '';
  users: User[] = [];
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'role', 'nationality', 'gender'];
  selectedUser: User | null = null;
  form: FormGroup;
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  isLoading: boolean = false;
  genders: Catalog[] = [];
  nationalities: Catalog[] = [];
  currentRoute: string = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCatalogs();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: User, filter: string) => {
          return data.firstname.toLowerCase().includes(filter.toLowerCase()) ||
            data.lastname.toLowerCase().includes(filter.toLowerCase()) ||
            data.email.toLowerCase().includes(filter.toLowerCase());
        };
      },
      error: (error) => this.handleError(error),
      complete: () => this.isLoading = false
    });
  }

  loadCatalogs(): void {
    this.catalogService.getGenders().subscribe({
      next: (data) => this.genders = data,
      error: (error) => this.handleError(error)
    });

    this.catalogService.getNationalities().subscribe({
      next: (data) => this.nationalities = data,
      error: (error) => this.handleError(error)
    });
  }

  refresh(): void {
    this.searchText = '';
    if (this.dataSource) {
      this.dataSource.filter = '';
    }
    this.loadUsers();
  }

  create(): void {
    this.selectedUser = null;
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
    if (this.selectedUser) {
      this.userService.deleteUser(this.selectedUser.id).subscribe({
        next: () => {
          this.openFlashMessage('Usuario eliminado exitosamente', 'success');
          this.loadUsers();
          this.onCancel();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onSelect(user: User): void {
    this.selectedUser = user;
    this.form.enable();

    // Convertir la fecha string a objeto Date si es necesario
    const birthDate = user.birth_date ? new Date(user.birth_date) : null;

    this.form.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      birth_date: birthDate,
      nationality: user.nationality,
      gender: user.gender
    });
    this.isEditMode = false;
    this.isDeleteMode = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const userData = { ...this.form.value };

      // Formatear la fecha al formato YYYY-MM-DD
      if (userData.birth_date) {
        userData.birth_date = this.datePipe.transform(userData.birth_date, 'yyyy-MM-dd');
      }

      if (this.selectedUser) {
        this.userService.updateUser(this.selectedUser.id, userData).subscribe({
          next: () => {
            this.openFlashMessage('Usuario actualizado exitosamente', 'success');
            this.loadUsers();
            this.onCancel();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.openFlashMessage('Usuario creado exitosamente', 'success');
            this.loadUsers();
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
    this.selectedUser = null;
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
      if (control.errors['email']) {
        return 'Email inválido';
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
        case 'firstname': return this.compare(a.firstname, b.firstname, isAsc);
        case 'lastname': return this.compare(a.lastname, b.lastname, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'role': return this.compare(a.role, b.role, isAsc);
        default: return 0;
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
