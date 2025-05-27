import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CatalogService } from '../../../services/catalogs/catalog.service';
import { Catalog } from '../../../models/catalogs/catalog.model';
import { User } from '../../../models/competencies/user.model';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    SharedModule, 
    MatDialogModule
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent {
  form: FormGroup;
  genders: Catalog[] = [];
  nationalities: Catalog[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: 'Player' | 'Coach', user?: User },
    private datePipe: DatePipe,
    private catalogService: CatalogService
  ) {
    this.form = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      role: [data.role]
    });

    if (data.user) {
      this.form.patchValue({
        ...data.user,
        birth_date: new Date(data.user.birth_date)
      });
    }

    this.loadCatalogs();
  }

  loadCatalogs(): void {
    this.catalogService.getGenders().subscribe({
      next: (data) => this.genders = data,
      error: (error) => console.error('Error loading genders:', error)
    });

    this.catalogService.getNationalities().subscribe({
      next: (data) => this.nationalities = data,
      error: (error) => console.error('Error loading nationalities:', error)
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const userData = {...this.form.value};
      if (userData.birth_date) {
        userData.birth_date = this.datePipe.transform(userData.birth_date, 'yyyy-MM-dd');
      }
      this.dialogRef.close(userData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['email']) return 'Email inválido';
    }
    return '';
  }
}
