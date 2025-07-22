import { Component, OnInit, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';

import { CatalogService } from '../../../core/services/catalogs';
import { Category, CreateCategoryDto, UpdateCategoryDto, getCategoryCodeFromUrl } from '../../../core/models/catalogs';
import { ApiUrlBuilder } from '../../../core/config/api-endpoints';
import { CategoryDialogComponent } from './category-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

/**
 * Componente para la gestión CRUD de categorías de catálogo
 */
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  template: `
    <div class="categories-container">
      <!-- Header con título y botón de crear -->
      <mat-toolbar class="header-toolbar">
        <span class="title">
          <mat-icon>category</mat-icon>
          Gestión de Categorías
        </span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nueva Categoría
        </button>
      </mat-toolbar>

      <!-- Filtros y búsqueda -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar categorías</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="filterCategories()" placeholder="Nombre o código...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrar por estado</mat-label>
              <mat-select [(value)]="statusFilter" (selectionChange)="filterCategories()">
                <mat-option value="all">Todos</mat-option>
                <mat-option value="active">Activos</mat-option>
                <mat-option value="inactive">Inactivos</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrar por nivel</mat-label>
              <mat-select [(value)]="levelFilter" (selectionChange)="filterCategories()">
                <mat-option value="all">Todos los niveles</mat-option>
                <mat-option value="0">Nivel 0</mat-option>
                <mat-option value="1">Nivel 1</mat-option>
                <mat-option value="2">Nivel 2</mat-option>
                <mat-option value="3">Nivel 3</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-icon-button matTooltip="Limpiar filtros" (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de categorías -->
      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading()" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando categorías...</p>
          </div>

          <div *ngIf="!loading() && totalCategories() === 0" class="no-data">
            <mat-icon class="no-data-icon">category</mat-icon>
            <h3>No se encontraron categorías</h3>
            <p>{{ categories().length === 0 ? 'Aún no hay categorías creadas.' : 'No hay categorías que coincidan con los filtros aplicados.' }}</p>
            <button *ngIf="categories().length === 0" mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Crear primera categoría
            </button>
          </div>

          <table *ngIf="!loading() && totalCategories() > 0" mat-table [dataSource]="paginatedCategories()" class="categories-table">
            <!-- Columna de Código -->
            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef>Código</th>
              <td mat-cell *matCellDef="let category">
                <span class="code-badge">{{ category.code }}</span>
              </td>
            </ng-container>

            <!-- Columna de Nombre -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let category">
                <div class="name-cell">
                  <strong>{{ category.name }}</strong>
                  <p class="description" *ngIf="category.description">{{ category.description }}</p>
                </div>
              </td>
            </ng-container>

            <!-- Columna de Nivel -->
            <ng-container matColumnDef="level">
              <th mat-header-cell *matHeaderCellDef>Nivel</th>
              <td mat-cell *matCellDef="let category">
                <span class="level-badge level-{{ category.level }}">
                  Nivel {{ category.level }}
                </span>
              </td>
            </ng-container>

            <!-- Columna de Versión -->
            <ng-container matColumnDef="version">
              <th mat-header-cell *matHeaderCellDef>Versión</th>
              <td mat-cell *matCellDef="let category">
                <span class="version-badge">v{{ category.version }}</span>
              </td>
            </ng-container>

            <!-- Columna de Estado -->
            <ng-container matColumnDef="isActive">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let category">
                <span class="status-badge" [class.active]="category.isActive" [class.inactive]="!category.isActive">
                  <mat-icon>{{ category.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                  {{ category.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <!-- Columna de Categoría Padre -->
            <ng-container matColumnDef="parentCatalog">
              <th mat-header-cell *matHeaderCellDef>Categoría Padre</th>
              <td mat-cell *matCellDef="let category">
                <span *ngIf="category.parent_catalog; else noParent" class="parent-info">
                  {{ getParentCategoryName(category.parent_catalog) }}
                </span>
                <ng-template #noParent>
                  <span class="no-parent">Sin padre</span>
                </ng-template>
              </td>
            </ng-container>

            <!-- Columna de Acciones -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let category">
                <div class="action-buttons">
                  <button mat-icon-button matTooltip="Editar" (click)="openEditDialog(category)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button
                          matTooltip="{{ category.isActive ? 'Desactivar' : 'Activar' }}"
                          (click)="toggleCategoryStatus(category)">
                    <mat-icon>{{ category.isActive ? 'toggle_on' : 'toggle_off' }}</mat-icon>
                  </button>
                  <button mat-icon-button
                          matTooltip="Eliminar"
                          color="warn"
                          (click)="confirmDelete(category)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <!-- Paginador -->
          <mat-paginator *ngIf="!loading() && totalCategories() > 0"
            #paginator
            [length]="totalCategories()"
            [pageSize]="pageSize()"
            [pageIndex]="pageIndex()"
            [pageSizeOptions]="pageSizeOptions"
            [showFirstLastButtons]="true"
            (page)="onPageChange($event)"
            aria-label="Seleccionar página de categorías">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .categories-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .filters-card, .table-card {
      margin-bottom: 20px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    .filter-field {
      min-width: 180px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      gap: 16px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
    }

    .no-data-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .categories-table {
      width: 100%;
    }

    .code-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .name-cell strong {
      color: #333;
      font-weight: 500;
    }

    .description {
      color: #666;
      font-size: 0.85rem;
      margin: 4px 0 0 0;
    }

    .level-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .level-0 {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .level-1 {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .level-2 {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .level-3 {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .version-badge {
      background-color: #f5f5f5;
      color: #666;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-badge.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .parent-info {
      color: #666;
      font-style: italic;
    }

    .no-parent {
      color: #999;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .action-buttons button {
      width: 36px;
      height: 36px;
    }

    /* Estilos para el paginador */
    .mat-mdc-paginator {
      margin-top: 16px;
      border-top: 1px solid #e0e0e0;

      .mat-mdc-paginator-range-label {
        margin: 0 16px;
      }

      .mat-mdc-icon-button {
        &:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        &[disabled] {
          opacity: 0.3;
        }
      }
    }

    @media (max-width: 768px) {
      .categories-container {
        padding: 10px;
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field, .filter-field {
        min-width: unset;
        width: 100%;
      }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Signals para manejo de estado
  categories = signal<Category[]>([]);
  filteredCategories = signal<Category[]>([]);
  loading = signal<boolean>(true);

  // Propiedades para filtros
  searchTerm = '';
  statusFilter = 'all';
  levelFilter = 'all';

  // Paginación
  pageSize = signal(10);
  pageIndex = signal(0);
  pageSizeOptions = [5, 10, 25, 50];

  // Categorías paginadas (computed)
  paginatedCategories = computed(() => {
    const filtered = this.filteredCategories();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return filtered.slice(startIndex, endIndex);
  });

  // Total de categorías (computed)
  totalCategories = computed(() => this.filteredCategories().length);

  // Columnas de la tabla
  displayedColumns: string[] = ['code', 'name', 'level', 'version', 'isActive', 'parentCatalog', 'actions'];

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Carga todas las categorías desde el servicio
   */
  loadCategories(): void {
    this.loading.set(true);
    this.catalogService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.filteredCategories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.snackBar.open('Error al cargar las categorías', 'Cerrar', { duration: 5000 });
        this.loading.set(false);
      }
    });
  }

  /**
   * Filtra las categorías según los criterios establecidos
   */
  filterCategories(): void {
    let filtered = [...this.categories()];

    // Filtro por búsqueda de texto
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(term) ||
        category.code.toLowerCase().includes(term) ||
        (category.description && category.description.toLowerCase().includes(term))
      );
    }

    // Filtro por estado
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(category => category.isActive === isActive);
    }

    // Filtro por nivel
    if (this.levelFilter !== 'all') {
      const level = parseInt(this.levelFilter);
      filtered = filtered.filter(category => category.level === level);
    }

    this.filteredCategories.set(filtered);
    this.resetPagination();
  }

  /**
   * Limpia todos los filtros aplicados
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.levelFilter = 'all';
    this.filteredCategories.set([...this.categories()]);
    this.resetPagination();
  }

  /**
   * Maneja eventos de paginación
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  /**
   * Reinicia la paginación a la primera página
   */
  resetPagination(): void {
    this.pageIndex.set(0);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  /**
   * Abre el diálogo para crear una nueva categoría
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: {
        mode: 'create',
        categories: this.categories() // Para seleccionar categoría padre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCategory(result);
      }
    });
  }

  /**
   * Abre el diálogo para editar una categoría existente
   */
  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        category: category,
        categories: this.categories().filter(c => c.code !== category.code) // Evitar que se seleccione a sí misma como padre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCategory(category.code, result);
      }
    });
  }

  /**
   * Crea una nueva categoría
   */
  createCategory(categoryData: CreateCategoryDto): void {
    this.catalogService.createCategory(categoryData).subscribe({
      next: (newCategory) => {
        const updatedCategories = [...this.categories(), newCategory];
        this.categories.set(updatedCategories);
        this.filterCategories();
        this.snackBar.open('Categoría creada exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        this.snackBar.open('Error al crear la categoría', 'Cerrar', { duration: 5000 });
      }
    });
  }

  /**
   * Actualiza una categoría existente
   */
  updateCategory(code: string, categoryData: UpdateCategoryDto): void {
    this.catalogService.updateCategory(code, categoryData).subscribe({
      next: (updatedCategory) => {
        const updatedCategories = this.categories().map(cat =>
          cat.code === code ? updatedCategory : cat
        );
        this.categories.set(updatedCategories);
        this.filterCategories();
        this.snackBar.open('Categoría actualizada exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al actualizar categoría:', error);
        this.snackBar.open('Error al actualizar la categoría', 'Cerrar', { duration: 5000 });
      }
    });
  }

  /**
   * Cambia el estado activo/inactivo de una categoría
   */
  toggleCategoryStatus(category: Category): void {
    const updateData: UpdateCategoryDto = {
      isActive: !category.isActive
    };

    this.updateCategory(category.code, updateData);
  }

  /**
   * Confirma y elimina una categoría
   */
  confirmDelete(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro de que desea eliminar la categoría "${category.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteCategory(category.code);
      }
    });
  }

  /**
   * Elimina una categoría
   */
  deleteCategory(code: string): void {
    this.catalogService.deleteCategory(code).subscribe({
      next: () => {
        const updatedCategories = this.categories().filter(cat => cat.code !== code);
        this.categories.set(updatedCategories);
        this.filterCategories();
        this.snackBar.open('Categoría eliminada exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al eliminar categoría:', error);
        this.snackBar.open('Error al eliminar la categoría', 'Cerrar', { duration: 5000 });
      }
    });
  }

  /**
   * Obtiene el nombre de la categoría padre por URL
   */
  getParentCategoryName(parentUrl: string): string {
    const parent = this.categories().find(cat => cat.url === parentUrl);
    return parent ? parent.name : 'Categoría no encontrada';
  }
}
