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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { Catalogue, CreateCatalogueDto, UpdateCatalogueDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de catálogos
 * Demuestra la integración completa con el microservicio ms-competencies a través de Kong
 */
@Component({
  selector: 'app-catalogues-management',
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
    ReactiveFormsModule
  ],
  template: `
    <div class="catalogues-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">category</mat-icon>
            Gestión de Catálogos
          </h1>
          <p class="page-subtitle">Administre los catálogos del sistema deportivo</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nuevo Catálogo
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
            <mat-icon class="stat-icon">inventory</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ catalogues.length }}</span>
              <span class="stat-label">Total Catálogos</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeCatalogues }}</span>
              <span class="stat-label">Activos</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingCatalogue ? 'edit' : 'add' }}</mat-icon>
            {{ editingCatalogue ? 'Editar' : 'Crear' }} Catálogo
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="catalogueForm" (ngSubmit)="onSubmit()" class="modern-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Código del Catálogo</mat-label>
                <input matInput formControlName="code" placeholder="Ej: CAT001" maxlength="10">
                <mat-icon matSuffix>tag</mat-icon>
                <mat-hint>Código único identificador</mat-hint>
                <mat-error *ngIf="catalogueForm.get('code')?.hasError('required')">
                  El código es obligatorio
                </mat-error>
                <mat-error *ngIf="catalogueForm.get('code')?.hasError('maxlength')">
                  Máximo 10 caracteres
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="description" 
                         placeholder="Descripción detallada del catálogo..."
                         rows="3" maxlength="255"></textarea>
                <mat-icon matSuffix>description</mat-icon>
                <mat-hint>{{ catalogueForm.get('description')?.value?.length || 0 }}/255 caracteres</mat-hint>
                <mat-error *ngIf="catalogueForm.get('description')?.hasError('required')">
                  La descripción es obligatoria
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="catalogueForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingCatalogue ? 'save' : 'add' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingCatalogue ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>view_list</mat-icon>
            Lista de Catálogos
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar catálogos</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Código o descripción...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando catálogos...</p>
          </div>

          <div *ngIf="!loading && catalogues.length === 0" class="empty-state">
            <mat-icon class="empty-icon">inventory</mat-icon>
            <h3>No hay catálogos disponibles</h3>
            <p>Comience creando su primer catálogo</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add</mat-icon>
              Crear Catálogo
            </button>
          </div>

          <div *ngIf="!loading && catalogues.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let catalogue">
                  <mat-chip class="id-chip">{{ catalogue.id }}</mat-chip>
                </td>
              </ng-container>

              <!-- Columna Código -->
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
                <td mat-cell *matCellDef="let catalogue">
                  <div class="code-display">
                    <mat-icon class="code-icon">tag</mat-icon>
                    <strong>{{ catalogue.code }}</strong>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Descripción -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
                <td mat-cell *matCellDef="let catalogue">
                  <div class="description-cell" [matTooltip]="catalogue.description">
                    {{ catalogue.description | slice:0:60 }}{{ catalogue.description.length > 60 ? '...' : '' }}
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let catalogue">
                  <mat-chip class="status-chip active">
                    <mat-icon>check_circle</mat-icon>
                    Activo
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let catalogue">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editCatalogue(catalogue)" 
                            matTooltip="Editar catálogo">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(catalogue)">
                        <mat-icon>visibility</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateCatalogue(catalogue)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteCatalogue(catalogue)" class="delete-action">
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
                  (click)="selectCatalogue(row)"></tr>
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
    .catalogues-container {
      padding: 24px;
      max-width: 1200px;
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
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      color: white;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
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

    .id-chip {
      background: #e3f2fd;
      color: #1976d2;
      font-weight: bold;
    }

    .code-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .code-icon {
      color: #666;
      font-size: 1.2rem;
    }

    .description-cell {
      max-width: 300px;
      line-height: 1.4;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #d32f2f;
    }

    @media (max-width: 768px) {
      .catalogues-container {
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
    }
  `]
})
export class CataloguesManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  catalogues: Catalogue[] = [];
  dataSource = new MatTableDataSource<Catalogue>([]);
  catalogueForm: FormGroup;
  displayedColumns: string[] = ['id', 'code', 'description', 'status', 'actions'];
  loading = false;
  showForm = false;
  editingCatalogue: Catalogue | null = null;
  activeCatalogues = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.catalogueForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.loadCatalogues();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCatalogues(): void {
    this.loading = true;
    this.competenciesService.getCatalogues().subscribe({
      next: (catalogues) => {
        this.catalogues = catalogues;
        this.dataSource.data = catalogues;
        this.activeCatalogues = catalogues.length; // Asumiendo que todos están activos por ahora
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading catalogues:', error);
        this.showError('Error al cargar los catálogos');
        this.loading = false;
        // Mostrar datos de ejemplo si hay error
        this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockCatalogues: Catalogue[] = [
      { id: 1, code: 'CAT001', description: 'Categorías de Deportes Acuáticos' },
      { id: 2, code: 'CAT002', description: 'Categorías de Deportes de Equipo' },
      { id: 3, code: 'CAT003', description: 'Categorías de Deportes Individuales' },
      { id: 4, code: 'CAT004', description: 'Categorías de Deportes de Combate' },
      { id: 5, code: 'CAT005', description: 'Categorías de Deportes de Precisión' }
    ];
    this.catalogues = mockCatalogues;
    this.dataSource.data = mockCatalogues;
    this.activeCatalogues = mockCatalogues.length;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingCatalogue = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingCatalogue = null;
    this.resetForm();
  }

  resetForm(): void {
    this.catalogueForm.reset();
    this.editingCatalogue = null;
  }

  onSubmit(): void {
    if (this.catalogueForm.valid) {
      this.loading = true;
      const formData = this.catalogueForm.value;

      if (this.editingCatalogue) {
        this.updateCatalogue(formData);
      } else {
        this.createCatalogue(formData);
      }
    }
  }

  createCatalogue(data: CreateCatalogueDto): void {
    this.competenciesService.createCatalogue(data).subscribe({
      next: (catalogue) => {
        this.showSuccess('Catálogo creado exitosamente');
        this.loadCatalogues();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating catalogue:', error);
        this.showError('Error al crear el catálogo');
        this.loading = false;
      }
    });
  }

  updateCatalogue(data: UpdateCatalogueDto): void {
    if (this.editingCatalogue?.id) {
      this.competenciesService.updateCatalogue(this.editingCatalogue.id, data).subscribe({
        next: (catalogue) => {
          this.showSuccess('Catálogo actualizado exitosamente');
          this.loadCatalogues();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating catalogue:', error);
          this.showError('Error al actualizar el catálogo');
          this.loading = false;
        }
      });
    }
  }

  editCatalogue(catalogue: Catalogue): void {
    this.editingCatalogue = catalogue;
    this.catalogueForm.patchValue({
      code: catalogue.code,
      description: catalogue.description
    });
    this.showForm = true;
  }

  deleteCatalogue(catalogue: Catalogue): void {
    if (confirm(`¿Está seguro que desea eliminar el catálogo "${catalogue.code}"?`)) {
      if (catalogue.id) {
        this.competenciesService.deleteCatalogue(catalogue.id).subscribe({
          next: () => {
            this.showSuccess('Catálogo eliminado exitosamente');
            this.loadCatalogues();
          },
          error: (error) => {
            console.error('Error deleting catalogue:', error);
            this.showError('Error al eliminar el catálogo');
          }
        });
      }
    }
  }

  selectCatalogue(catalogue: Catalogue): void {
    // Implementar selección si es necesario
    console.log('Selected catalogue:', catalogue);
  }

  viewDetails(catalogue: Catalogue): void {
    // Implementar vista de detalles
    this.showInfo(`Detalles del catálogo: ${catalogue.code}`);
  }

  duplicateCatalogue(catalogue: Catalogue): void {
    const duplicateData: CreateCatalogueDto = {
      code: `${catalogue.code}_COPY`,
      description: `Copia de ${catalogue.description}`
    };
    this.createCatalogue(duplicateData);
  }

  refreshData(): void {
    this.loadCatalogues();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
