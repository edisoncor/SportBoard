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
import { MatChipsModule } from '@angular/material/chips';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';

/**
 * Componente para la gestión CRUD de reglas de competencias
 */
@Component({
  selector: 'app-rules',
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
    MatPaginatorModule,
    MatChipsModule
  ],
  template: `
    <div class="rules-container">
      <!-- Header con título y botón de crear -->
      <mat-toolbar class="header-toolbar">
        <span class="title">
          <mat-icon>gavel</mat-icon>
          Gestión de Reglas
        </span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon>
          Nueva Regla
        </button>
      </mat-toolbar>

      <!-- Filtros y búsqueda -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar reglas</mat-label>
              <input matInput [(ngModel)]="searchTerm" (input)="filterRules()" placeholder="Nombre o descripción...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrar por estado</mat-label>
              <mat-select [(value)]="statusFilter" (selectionChange)="filterRules()">
                <mat-option value="all">Todos</mat-option>
                <mat-option value="active">Activos</mat-option>
                <mat-option value="inactive">Inactivos</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrar por nivel</mat-label>
              <mat-select [(value)]="levelFilter" (selectionChange)="filterRules()">
                <mat-option value="all">Todos los niveles</mat-option>
                <mat-option *ngFor="let level of availableLevels" [value]="level">
                  Nivel {{level}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-icon-button matTooltip="Limpiar filtros" (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de reglas -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container" *ngIf="!isLoading(); else loadingSpinner">
            <table mat-table [dataSource]="filteredRules()" class="rules-table" matSort>
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
                <td mat-cell *matCellDef="let rule"> {{rule.id}} </td>
              </ng-container>

              <!-- Nombre Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Nombre </th>
                <td mat-cell *matCellDef="let rule"> 
                  <strong>{{rule.name}}</strong>
                </td>
              </ng-container>

              <!-- Descripción Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef> Descripción </th>
                <td mat-cell *matCellDef="let rule"> 
                  <span [matTooltip]="rule.description" class="description-text">
                    {{rule.description | slice:0:50}}{{rule.description.length > 50 ? '...' : ''}}
                  </span>
                </td>
              </ng-container>

              <!-- Nivel Column -->
              <ng-container matColumnDef="level">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Nivel </th>
                <td mat-cell *matCellDef="let rule"> 
                  <mat-chip [color]="getLevelColor(rule.level)">Nivel {{rule.level}}</mat-chip>
                </td>
              </ng-container>

              <!-- Estado Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Estado </th>
                <td mat-cell *matCellDef="let rule">
                  <mat-slide-toggle 
                    [checked]="rule.isActive" 
                    (change)="toggleRuleStatus(rule)"
                    [disabled]="isUpdating()">
                  </mat-slide-toggle>
                  <span class="status-text" [class.active]="rule.isActive" [class.inactive]="!rule.isActive">
                    {{rule.isActive ? 'Activo' : 'Inactivo'}}
                  </span>
                </td>
              </ng-container>

              <!-- Acciones Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Acciones </th>
                <td mat-cell *matCellDef="let rule">
                  <button mat-icon-button matTooltip="Editar" (click)="openEditDialog(rule)" color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Eliminar" (click)="confirmDelete(rule)" color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <!-- Mensaje cuando no hay datos -->
            <div class="no-data" *ngIf="filteredRules().length === 0">
              <mat-icon>info</mat-icon>
              <p>No se encontraron reglas con los filtros aplicados.</p>
              <button mat-raised-button color="primary" (click)="clearFilters()">
                Limpiar filtros
              </button>
            </div>
          </div>

          <!-- Loading spinner -->
          <ng-template #loadingSpinner>
            <div class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
              <p>Cargando reglas...</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Paginador -->
      <mat-paginator 
        #paginator
        [length]="filteredRules().length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 50]"
        showFirstLastButtons
        aria-label="Seleccionar página de reglas">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .rules-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px 8px 0 0;
      margin-bottom: 0;
    }

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1;
    }

    .filters-card {
      margin-bottom: 24px;
      border-radius: 0;
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
      min-width: 150px;
    }

    .table-card {
      border-radius: 0 0 8px 8px;
      margin-top: 0;
    }

    .table-container {
      overflow-x: auto;
    }

    .rules-table {
      width: 100%;
      margin-bottom: 16px;
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    .description-text {
      max-width: 200px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-text {
      margin-left: 8px;
      font-size: 0.875rem;
    }

    .status-text.active {
      color: #4caf50;
    }

    .status-text.inactive {
      color: #f44336;
    }

    .no-data {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 16px;
    }

    mat-chip {
      font-size: 0.75rem;
      min-height: 20px;
    }

    @media (max-width: 768px) {
      .rules-container {
        padding: 16px;
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field, .filter-field {
        min-width: auto;
        width: 100%;
      }

      .table-container {
        font-size: 0.875rem;
      }
    }
  `]
})
export class RulesComponent implements OnInit {
  private competenciesService = inject(CompetenciesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Signals para estado reactivo
  rules = signal<any[]>([]);
  isLoading = signal(false);
  isUpdating = signal(false);

  // Filtros
  searchTerm = '';
  statusFilter = 'all';
  levelFilter = 'all';
  availableLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Configuración de tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'level', 'isActive', 'actions'];
  pageSize = 10;

  // Computed para reglas filtradas
  filteredRules = computed(() => {
    let filtered = this.rules();

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(rule => 
        rule.name.toLowerCase().includes(term) ||
        rule.description.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(rule => rule.isActive === isActive);
    }

    // Filtro por nivel
    if (this.levelFilter !== 'all') {
      filtered = filtered.filter(rule => rule.level === parseInt(this.levelFilter));
    }

    return filtered;
  });

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.isLoading.set(true);
    
    // Simulando la llamada al servicio con datos mock por ahora
    setTimeout(() => {
      this.rules.set([
        {
          id: 1,
          name: 'Regla de Fuera de Juego',
          description: 'Un jugador está en fuera de juego si está más cerca de la línea de gol que el balón y el segundo último oponente.',
          level: 1,
          isActive: true
        },
        {
          id: 2,
          name: 'Regla de Manos',
          description: 'No se permite el uso intencional de las manos o brazos para tocar el balón.',
          level: 2,
          isActive: true
        },
        {
          id: 3,
          name: 'Regla de Tarjeta Roja',
          description: 'Faltas graves que resultan en expulsión inmediata del jugador.',
          level: 5,
          isActive: false
        }
      ]);
      this.isLoading.set(false);
    }, 1000);
  }

  filterRules() {
    // Los filtros se aplican automáticamente gracias al computed
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.levelFilter = 'all';
  }

  getLevelColor(level: number): string {
    if (level <= 3) return 'primary';
    if (level <= 6) return 'accent';
    return 'warn';
  }

  openCreateDialog() {
    // TODO: Implementar diálogo de creación
    this.snackBar.open('Función de crear regla en desarrollo', 'Cerrar', {
      duration: 3000
    });
  }

  openEditDialog(rule: any) {
    // TODO: Implementar diálogo de edición
    this.snackBar.open(`Editar regla: ${rule.name}`, 'Cerrar', {
      duration: 3000
    });
  }

  toggleRuleStatus(rule: any) {
    this.isUpdating.set(true);
    
    // Simular actualización
    setTimeout(() => {
      rule.isActive = !rule.isActive;
      this.snackBar.open(
        `Regla ${rule.isActive ? 'activada' : 'desactivada'} correctamente`,
        'Cerrar',
        { duration: 3000 }
      );
      this.isUpdating.set(false);
    }, 500);
  }

  confirmDelete(rule: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar la regla "${rule.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRule(rule);
      }
    });
  }

  deleteRule(rule: any) {
    this.isLoading.set(true);
    
    // Simular eliminación
    setTimeout(() => {
      const currentRules = this.rules();
      this.rules.set(currentRules.filter(r => r.id !== rule.id));
      this.snackBar.open('Regla eliminada correctamente', 'Cerrar', {
        duration: 3000
      });
      this.isLoading.set(false);
    }, 500);
  }
}
