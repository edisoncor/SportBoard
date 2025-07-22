import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../../core/models/catalogs';

export interface CategoryDialogData {
  mode: 'create' | 'edit';
  category?: Category;
  categories: Category[];
}

/**
 * Componente de diálogo para crear/editar categorías
 */
@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
          {{ isEditMode ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="categoryForm" class="category-form">
          <!-- Información básica -->
          <div class="form-section">
            <h3 class="section-title">Información Básica</h3>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre de la categoría</mat-label>
                <input matInput formControlName="name" placeholder="Ej: Deportes de Equipo">
                <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                  El nombre es obligatorio
                </mat-error>
                <mat-error *ngIf="categoryForm.get('name')?.hasError('minlength')">
                  El nombre debe tener al menos 2 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Código único</mat-label>
                <input matInput formControlName="code" placeholder="Ej: SPORT_TEAM">
                <mat-hint>El código debe ser único y se recomienda usar MAYÚSCULAS_CON_GUIONES</mat-hint>
                <mat-error *ngIf="categoryForm.get('code')?.hasError('required')">
                  El código es obligatorio
                </mat-error>
                <mat-error *ngIf="categoryForm.get('code')?.hasError('pattern')">
                  El código debe contener solo letras, números y guiones bajos
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="description"
                         rows="3"
                         placeholder="Descripción detallada de la categoría..."></textarea>
              </mat-form-field>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Configuración de jerarquía -->
          <div class="form-section">
            <h3 class="section-title">Configuración de Jerarquía</h3>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nivel jerárquico</mat-label>
                <mat-select formControlName="level">
                  <mat-option value="0">Nivel 0 (Raíz)</mat-option>
                  <mat-option value="1">Nivel 1</mat-option>
                  <mat-option value="2">Nivel 2</mat-option>
                  <mat-option value="3">Nivel 3</mat-option>
                </mat-select>
                <mat-hint>Nivel 0 para categorías principales</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Categoría padre</mat-label>
                <mat-select formControlName="parent_catalog">
                  <mat-option [value]="null">Sin categoría padre</mat-option>
                  <mat-option *ngFor="let category of availableParents()" [value]="category.url">
                    {{ category.name }} ({{ category.code }}) - Nivel {{ category.level }}
                  </mat-option>
                </mat-select>
                <mat-hint>Seleccione una categoría padre si corresponde</mat-hint>
              </mat-form-field>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Estado y configuración adicional -->
          <div class="form-section">
            <h3 class="section-title">Estado y Configuración</h3>

            <div class="form-row">
              <mat-slide-toggle formControlName="isActive" class="status-toggle">
                <span class="toggle-label">
                  <mat-icon>{{ categoryForm.get('isActive')?.value ? 'check_circle' : 'cancel' }}</mat-icon>
                  {{ categoryForm.get('isActive')?.value ? 'Categoría Activa' : 'Categoría Inactiva' }}
                </span>
              </mat-slide-toggle>
            </div>

            <div class="form-row info-section" *ngIf="isEditMode && data.category">
              <div class="info-item">
                <span class="info-label">Versión actual:</span>
                <span class="info-value">v{{ data.category.version }}</span>
              </div>
              <div class="info-item" *ngIf="data.category.createdAt">
                <span class="info-label">Creado:</span>
                <span class="info-value">{{ data.category.createdAt | date:'short' }}</span>
              </div>
              <div class="info-item" *ngIf="data.category.updatedAt">
                <span class="info-label">Última actualización:</span>
                <span class="info-value">{{ data.category.updatedAt | date:'short' }}</span>
              </div>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button mat-dialog-close type="button">
          <mat-icon>cancel</mat-icon>
          Cancelar
        </button>
        <button mat-raised-button
                color="primary"
                [disabled]="!categoryForm.valid || saving()"
                (click)="onSubmit()">
          <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
          {{ saving() ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 500px;
      max-width: 600px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .dialog-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #333;
    }

    .dialog-content {
      padding: 0 24px 24px 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .category-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .status-toggle {
      margin: 8px 0;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .info-section {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      flex-direction: column;
      gap: 8px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-label {
      font-weight: 500;
      color: #666;
    }

    .info-value {
      color: #333;
      font-family: 'Roboto Mono', monospace;
    }

    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
      justify-content: flex-end;
    }

    .dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-divider {
      margin: 16px 0;
    }

    @media (max-width: 600px) {
      .dialog-container {
        min-width: unset;
        width: 95vw;
      }

      .form-row {
        flex-direction: column;
        gap: 8px;
      }

      .half-width {
        width: 100%;
      }
    }
  `]
})
export class CategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  saving = signal(false);
  isEditMode: boolean;
  availableParents = signal<Category[]>([]);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupForm();
    this.updateAvailableParents();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
      description: [''],
      level: [0, [Validators.required, Validators.min(0), Validators.max(3)]],
      parent_catalog: [null],
      isActive: [true]
    });
  }

  private setupForm(): void {
    if (this.isEditMode && this.data.category) {
      const category = this.data.category;
      this.categoryForm.patchValue({
        name: category.name,
        code: category.code,
        description: category.description || '',
        level: category.level,
        parent_catalog: category.parent_catalog || null,
        isActive: category.isActive
      });
    }

    this.categoryForm.get('level')?.valueChanges.subscribe(() => {
      this.updateAvailableParents();
      this.categoryForm.get('parent_catalog')?.setValue(null);
    });
  }

  private updateAvailableParents(): void {
    const selectedLevel = this.categoryForm.get('level')?.value;

    if (selectedLevel === 0) {
      this.availableParents.set([]);
      this.categoryForm.get('parent_catalog')?.setValue(null);
      this.categoryForm.get('parent_catalog')?.disable();
    } else {
      const available = this.data.categories.filter(cat =>
        cat.level < selectedLevel && cat.isActive
      );
      this.availableParents.set(available);
      this.categoryForm.get('parent_catalog')?.enable();
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid && !this.saving()) {
      this.saving.set(true);

      const formValue = this.categoryForm.value;

      const categoryData = {
        name: formValue.name.trim(),
        code: formValue.code.trim().toUpperCase(),
        description: formValue.description?.trim() || undefined,
        level: parseInt(formValue.level),
        parent_catalog: formValue.parent_catalog || undefined,
        isActive: formValue.isActive
      };

      setTimeout(() => {
        this.saving.set(false);
        this.dialogRef.close(categoryData);
      }, 500);
    }
  }
}
