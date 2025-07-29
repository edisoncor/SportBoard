import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { CompetencyCategory } from '../../../core/models/competencies/Category';

/**
 * Componente para la gestión de categorías de competencias
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-competency-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="categories-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">category</mat-icon>
            Categorías de Competencias
          </h1>
          <p class="page-subtitle">Administre las categorías del sistema deportivo</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nueva Categoría
          </button>
          <button mat-icon-button matTooltip="Actualizar lista" (click)="refreshData()">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="stats-row">
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">category</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ categories.length }}</span>
              <span class="stat-label">Total Categorías</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">groups</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ juvenilCategories }}</span>
              <span class="stat-label">Juveniles</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">workspace_premium</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ seniorCategories }}</span>
              <span class="stat-label">Senior</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingCategory ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingCategory ? 'Editar' : 'Crear' }} Categoría
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información Básica
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Categoría</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Juvenil Sub-18">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Regla Asociada</mat-label>
                  <mat-select formControlName="rule">
                    <mat-option [value]="1">Regla General de Fútbol</mat-option>
                    <mat-option [value]="2">Regla Juvenil Modificada</mat-option>
                    <mat-option [value]="3">Regla Veteranos</mat-option>
                    <mat-option [value]="4">Regla Femenina</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>rule</mat-icon>
                  <mat-error *ngIf="categoryForm.get('rule')?.hasError('required')">
                    La regla es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Edad Inicial</mat-label>
                  <input matInput formControlName="age_init" type="number" placeholder="16" min="0" max="100">
                  <mat-icon matSuffix>child_care</mat-icon>
                  <mat-error *ngIf="categoryForm.get('age_init')?.hasError('required')">
                    La edad inicial es obligatoria
                  </mat-error>
                  <mat-hint>Edad mínima permitida</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Edad Final</mat-label>
                  <input matInput formControlName="age_end" type="number" placeholder="20" min="0" max="100">
                  <mat-icon matSuffix>elderly</mat-icon>
                  <mat-error *ngIf="categoryForm.get('age_end')?.hasError('required')">
                    La edad final es obligatoria
                  </mat-error>
                  <mat-hint>Edad máxima permitida</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="categoryForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingCategory ? 'save' : 'add_circle' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Crear') }}
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de datos mejorada -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>category</mat-icon>
            Lista de Categorías
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar categorías</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, edad...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando categorías...</p>
          </div>

          <div *ngIf="!loading && categories.length === 0" class="empty-state">
            <mat-icon class="empty-icon">category</mat-icon>
            <h3>No hay categorías registradas</h3>
            <p>Comience agregando su primera categoría</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Categoría
            </button>
          </div>

          <div *ngIf="!loading && categories.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-id">
                    <div class="category-icon">
                      <mat-icon>category</mat-icon>
                    </div>
                    <span class="id-number">{{ category.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Categoría</th>
                <td mat-cell *matCellDef="let category">
                  <div class="category-info">
                    <div class="category-name">{{ category.name }}</div>
                    <div class="category-type">{{ getCategoryType(category) }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Rango de Edad -->
              <ng-container matColumnDef="ageRange">
                <th mat-header-cell *matHeaderCellDef>Rango de Edad</th>
                <td mat-cell *matCellDef="let category">
                  <mat-chip class="age-chip">
                    <mat-icon>cake</mat-icon>
                    {{ category.age_init }} - {{ category.age_end }} años
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Regla -->
              <ng-container matColumnDef="rule">
                <th mat-header-cell *matHeaderCellDef>Regla</th>
                <td mat-cell *matCellDef="let category">
                  <mat-chip class="rule-chip" [class]="getRuleClass(category.rule)">
                    <mat-icon>{{ getRuleIcon(category.rule) }}</mat-icon>
                    {{ getRuleDisplay(category.rule) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let category">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editCategory(category)" 
                            matTooltip="Editar categoría">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(category)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateCategory(category)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteCategory(category)" class="delete-action">
                        <mat-icon>delete</mat-icon>
                        Eliminar
                      </button>
                    </mat-menu>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="table-row" 
                  (click)="selectCategory(row)"></tr>
            </table>

            <mat-paginator #paginator 
                           [pageSizeOptions]="[5, 10, 20]" 
                           showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .categories-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .title-section {
      flex: 1;
    }

    .page-title {
      display: flex;
      align-items: center;
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0 0 8px 0;
      color: #1976d2;
    }

    .title-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 16px;
    }

    .page-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .create-btn {
      padding: 12px 24px;
      font-size: 1rem;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      padding: 20px;
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      opacity: 0.9;
    }

    .stat-text {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .form-card {
      margin-bottom: 24px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .form-card:not(.expanded) {
      max-height: 80px;
    }

    .form-card.expanded {
      max-height: 500px;
    }

    .form-actions {
      margin-left: auto;
    }

    .modern-form {
      padding: 16px 0;
    }

    .form-section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 1.2rem;
      color: #3f51b5;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-field {
      width: 100%;
    }

    .form-actions-row {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .submit-btn {
      min-width: 120px;
      position: relative;
    }

    .table-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .table-actions {
      margin-left: auto;
    }

    .search-field {
      width: 300px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .table-container {
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      background: white;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .table-row:hover {
      background-color: #f5f5f5;
    }

    .category-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .category-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e8eaf6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3f51b5;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .category-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .category-type {
      font-size: 0.8rem;
      color: #666;
    }

    .age-chip {
      font-size: 0.8rem;
      background: #e1f5fe;
      color: #0277bd;
    }

    .rule-chip {
      font-size: 0.8rem;
    }

    .rule-chip.rule-1 {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .rule-chip.rule-2 {
      background: #fff3e0;
      color: #f57c00;
    }

    .rule-chip.rule-3 {
      background: #e3f2fd;
      color: #1976d2;
    }

    .rule-chip.rule-4 {
      background: #fce4ec;
      color: #c2185b;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #d32f2f;
    }

    @media (max-width: 768px) {
      .categories-container {
        padding: 16px;
      }
      
      .header-section {
        flex-direction: column;
        gap: 16px;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .search-field {
        width: 100%;
      }

      .stats-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CompetencyCategoriesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categories: CompetencyCategory[] = [];
  dataSource = new MatTableDataSource<CompetencyCategory>([]);
  categoryForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'ageRange', 'rule', 'actions'];
  loading = false;
  showForm = false;
  editingCategory: CompetencyCategory | null = null;
  juvenilCategories = 0;
  seniorCategories = 0;
  totalCategories = 0;

  mockCategories: CompetencyCategory[] = [
    {
      id: 1,
      name: 'Juvenil Sub-18',
      age_init: 16,
      age_end: 18,
      rule: 1
    },
    {
      id: 2,
      name: 'Juvenil Sub-20',
      age_init: 18,
      age_end: 20,
      rule: 1
    },
    {
      id: 3,
      name: 'Senior',
      age_init: 21,
      age_end: 35,
      rule: 2
    },
    {
      id: 4,
      name: 'Veteranos',
      age_init: 36,
      age_end: 50,
      rule: 3
    }
  ];

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      age_init: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      age_end: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      rule: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.loading = true;
    this.competenciesService.getCompetencyCategories().subscribe({
      next: (categories: any[]) => {
        this.categories = categories;
        this.dataSource.data = categories;
        this.totalCategories = categories.length;
        this.juvenilCategories = categories.filter((c: any) => (c.age_end ?? 25) <= 20).length;
        this.seniorCategories = categories.filter((c: any) => (c.age_init ?? 16) >= 21).length;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error al cargar las categorías', 'Cerrar', { duration: 3000 });
        this.loading = false;
        // Comentamos showMockData para usar solo datos reales
        // this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockCategories: CompetencyCategory[] = [
      {
        id: 1,
        name: 'Juvenil Sub-18',
        age_init: 16,
        age_end: 18,
        rule: 1
      },
      {
        id: 2,
        name: 'Juvenil Sub-20',
        age_init: 18,
        age_end: 20,
        rule: 1
      },
      {
        id: 3,
        name: 'Senior',
        age_init: 21,
        age_end: 35,
        rule: 2
      },
      {
        id: 4,
        name: 'Veteranos',
        age_init: 36,
        age_end: 50,
        rule: 3
      }
    ];
    this.categories = mockCategories;
    this.dataSource.data = mockCategories;
    this.juvenilCategories = mockCategories.filter(c => c.age_end <= 20).length;
    this.seniorCategories = mockCategories.filter(c => c.age_init >= 21).length;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingCategory = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingCategory = null;
    this.resetForm();
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.editingCategory = null;
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.loading = true;
      const formData = this.categoryForm.value;

      if (this.editingCategory) {
        this.updateCategory(formData);
      } else {
        this.createCategory(formData);
      }
    }
  }

  createCategory(data: any): void {
    // Simulación de creación exitosa
    const newCategory = {
      id: Math.max(...this.categories.map(c => c.id || 0)) + 1,
      ...data
    };
    this.categories.push(newCategory);
    this.dataSource.data = this.categories;
    this.showSuccess('Categoría creada exitosamente');
    this.loadCategories();
    this.hideCreateForm();
    this.loading = false;
  }

  updateCategory(data: any): void {
    if (this.editingCategory?.id) {
      // Simulación de actualización exitosa
      const index = this.categories.findIndex(c => c.id === this.editingCategory?.id);
      if (index !== -1) {
        this.categories[index] = { ...this.categories[index], ...data };
        this.dataSource.data = this.categories;
      }
      this.showSuccess('Categoría actualizada exitosamente');
      this.loadCategories();
      this.hideCreateForm();
      this.loading = false;
    }
  }

  editCategory(category: CompetencyCategory): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      age_init: category.age_init,
      age_end: category.age_end,
      rule: category.rule
    });
    this.showForm = true;
  }

  deleteCategory(category: CompetencyCategory): void {
    if (confirm(`¿Está seguro que desea eliminar la categoría "${category.name}"?`)) {
      if (category.id) {
        // Simulación de eliminación exitosa
        const index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          this.categories.splice(index, 1);
          this.dataSource.data = this.categories;
        }
        this.showSuccess('Categoría eliminada exitosamente');
        this.loadCategories();
      }
    }
  }

  duplicateCategory(category: CompetencyCategory): void {
    const duplicatedCategory = {
      name: `${category.name} (Copia)`,
      age_init: category.age_init,
      age_end: category.age_end,
      rule: category.rule
    };
    
    // Simulación de duplicación exitosa
    this.categories.push(duplicatedCategory);
    this.dataSource.data = this.categories;
    this.showSuccess('Categoría duplicada exitosamente');
  }

  selectCategory(category: CompetencyCategory): void {
    console.log('Selected category:', category);
  }

  viewDetails(category: CompetencyCategory): void {
    this.showInfo(`Categoría: ${category.name}`);
  }

  refreshData(): void {
    this.loadCategories();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCategoryType(category: CompetencyCategory): string {
    if (category.age_end <= 20) return 'Categoría Juvenil';
    if (category.age_init >= 36) return 'Categoría Veteranos';
    return 'Categoría Senior';
  }

  getRuleClass(rule: number): string {
    return `rule-${rule}`;
  }

  getRuleIcon(rule: number): string {
    const icons: { [key: number]: string } = {
      1: 'sports_soccer',
      2: 'sports',
      3: 'elderly',
      4: 'female'
    };
    return icons[rule] || 'rule';
  }

  getRuleDisplay(rule: number): string {
    const rules: { [key: number]: string } = {
      1: 'General',
      2: 'Juvenil',
      3: 'Veteranos',
      4: 'Femenina'
    };
    return rules[rule] || 'Sin definir';
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
