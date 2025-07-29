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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { GameState, CreateGameStateDto, UpdateGameStateDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de estados de juego
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-game-states',
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
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="game-states-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">sports_esports</mat-icon>
            Estados de Juego
          </h1>
          <p class="page-subtitle">Administre los estados del sistema de competencias</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nuevo Estado
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
            <mat-icon class="stat-icon">sports_esports</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ gameStates.length }}</span>
              <span class="stat-label">Total Estados</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeStates }}</span>
              <span class="stat-label">Activos</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">pause_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ inactiveStates }}</span>
              <span class="stat-label">Inactivos</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingGameState ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingGameState ? 'Editar' : 'Crear' }} Estado de Juego
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="gameStateForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información del Estado
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre del Estado</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: En Progreso">
                  <mat-icon matSuffix>label</mat-icon>
                  <mat-error *ngIf="gameStateForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                  <mat-error *ngIf="gameStateForm.get('name')?.hasError('maxlength')">
                    Máximo 100 caracteres
                  </mat-error>
                </mat-form-field>

                <div class="toggle-section">
                  <mat-slide-toggle formControlName="isActive" color="primary">
                    <span class="toggle-label">
                      <mat-icon>{{ gameStateForm.get('isActive')?.value ? 'check_circle' : 'cancel' }}</mat-icon>
                      {{ gameStateForm.get('isActive')?.value ? 'Estado Activo' : 'Estado Inactivo' }}
                    </span>
                  </mat-slide-toggle>
                </div>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" 
                           placeholder="Descripción detallada del estado..."
                           rows="4" maxlength="500"></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                  <mat-error *ngIf="gameStateForm.get('description')?.hasError('required')">
                    La descripción es obligatoria
                  </mat-error>
                  <mat-hint>{{ gameStateForm.get('description')?.value?.length || 0 }}/500 caracteres</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="gameStateForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingGameState ? 'save' : 'add_circle' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingGameState ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>sports_esports</mat-icon>
            Lista de Estados de Juego
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar estados</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, descripción...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando estados...</p>
          </div>

          <div *ngIf="!loading && gameStates.length === 0" class="empty-state">
            <mat-icon class="empty-icon">sports_esports</mat-icon>
            <h3>No hay estados registrados</h3>
            <p>Comience agregando su primer estado de juego</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Estado
            </button>
          </div>

          <div *ngIf="!loading && gameStates.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let state">
                  <div class="state-id">
                    <div class="state-icon">
                      <mat-icon>sports_esports</mat-icon>
                    </div>
                    <span class="id-number">{{ state.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                <td mat-cell *matCellDef="let state">
                  <div class="state-info">
                    <div class="state-name">{{ state.name }}</div>
                    <div class="state-description">{{ state.description | slice:0:60 }}{{ state.description?.length > 60 ? '...' : '' }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let state">
                  <mat-chip class="status-chip" [class]="state.isActive ? 'active' : 'inactive'">
                    <mat-icon>{{ state.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                    {{ state.isActive ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let state">
                  <div class="dates-info">
                    <div class="created-date">
                      <mat-icon class="date-icon">schedule</mat-icon>
                      {{ state.createdAt | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="updated-date" *ngIf="state.updatedAt">
                      <mat-icon class="date-icon">update</mat-icon>
                      {{ state.updatedAt | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let state">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editGameState(state)" 
                            matTooltip="Editar estado">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(state)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateGameState(state)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="toggleStatus(state)">
                        <mat-icon>{{ state.isActive ? 'toggle_off' : 'toggle_on' }}</mat-icon>
                        {{ state.isActive ? 'Desactivar' : 'Activar' }}
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteGameState(state)" class="delete-action">
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
                  (click)="selectGameState(row)"></tr>
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
    .game-states-container {
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
      background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
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
      max-height: 600px;
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
      color: #e91e63;
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

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .toggle-section {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
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

    .state-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .state-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fce4ec;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e91e63;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .state-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .state-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .state-description {
      font-size: 0.8rem;
      color: #666;
      line-height: 1.4;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-chip.inactive {
      background: #ffebee;
      color: #d32f2f;
    }

    .dates-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .created-date,
    .updated-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: #666;
    }

    .date-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #d32f2f;
    }

    @media (max-width: 768px) {
      .game-states-container {
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
export class GameStatesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  gameStates: GameState[] = [];
  dataSource = new MatTableDataSource<GameState>([]);
  gameStateForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'status', 'dates', 'actions'];
  loading = false;
  showForm = false;
  editingGameState: GameState | null = null;
  activeStates = 0;
  inactiveStates = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.gameStateForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadGameStates();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGameStates(): void {
    this.loading = true;
    this.competenciesService.getGameStates().subscribe({
      next: (states) => {
        this.gameStates = states;
        this.dataSource.data = states;
        // Usar valores por defecto si las propiedades no existen
        this.activeStates = states.filter(s => s.isActive ?? true).length;
        this.inactiveStates = states.filter(s => !(s.isActive ?? true)).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading game states:', error);
        this.showError('Error al cargar los estados de juego');
        this.loading = false;
        // Comentamos showMockData para usar solo datos reales
        // this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockStates: GameState[] = [
      {
        id: 1,
        name: 'Programado',
        description: 'El juego está programado pero aún no ha comenzado',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'En Progreso',
        description: 'El juego está actualmente en curso',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 3,
        name: 'Finalizado',
        description: 'El juego ha terminado oficialmente',
        isActive: true,
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 4,
        name: 'Cancelado',
        description: 'El juego fue cancelado por motivos externos',
        isActive: false,
        createdAt: '2024-01-15T11:30:00Z'
      },
      {
        id: 5,
        name: 'Suspendido',
        description: 'El juego fue suspendido temporalmente',
        isActive: true,
        createdAt: '2024-01-15T12:00:00Z'
      }
    ];
    this.gameStates = mockStates;
    this.dataSource.data = mockStates;
    this.activeStates = mockStates.filter(s => s.isActive).length;
    this.inactiveStates = mockStates.filter(s => !s.isActive).length;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingGameState = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingGameState = null;
    this.resetForm();
  }

  resetForm(): void {
    this.gameStateForm.reset({
      isActive: true
    });
    this.editingGameState = null;
  }

  onSubmit(): void {
    if (this.gameStateForm.valid) {
      this.loading = true;
      const formData = this.gameStateForm.value;

      if (this.editingGameState) {
        this.updateGameState(formData);
      } else {
        this.createGameState(formData);
      }
    }
  }

  createGameState(data: CreateGameStateDto): void {
    this.competenciesService.createGameState(data).subscribe({
      next: (state) => {
        this.showSuccess('Estado de juego creado exitosamente');
        this.loadGameStates();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating game state:', error);
        this.showError('Error al crear el estado de juego');
        this.loading = false;
      }
    });
  }

  updateGameState(data: UpdateGameStateDto): void {
    if (this.editingGameState?.id) {
      this.competenciesService.updateGameState(this.editingGameState.id, data).subscribe({
        next: (state) => {
          this.showSuccess('Estado de juego actualizado exitosamente');
          this.loadGameStates();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating game state:', error);
          this.showError('Error al actualizar el estado de juego');
          this.loading = false;
        }
      });
    }
  }

  editGameState(state: GameState): void {
    this.editingGameState = state;
    this.gameStateForm.patchValue({
      name: state.name,
      description: state.description,
      isActive: state.isActive
    });
    this.showForm = true;
  }

  deleteGameState(state: GameState): void {
    if (confirm(`¿Está seguro que desea eliminar el estado "${state.name}"?`)) {
      if (state.id) {
        this.competenciesService.deleteGameState(state.id).subscribe({
          next: () => {
            this.showSuccess('Estado de juego eliminado exitosamente');
            this.loadGameStates();
          },
          error: (error) => {
            console.error('Error deleting game state:', error);
            this.showError('Error al eliminar el estado de juego');
          }
        });
      }
    }
  }

  duplicateGameState(state: GameState): void {
    const duplicatedState: CreateGameStateDto = {
      name: `${state.name} (Copia)`,
      description: state.description,
      isActive: false
    };
    
    this.competenciesService.createGameState(duplicatedState).subscribe({
      next: () => {
        this.showSuccess('Estado de juego duplicado exitosamente');
        this.loadGameStates();
      },
      error: (error) => {
        console.error('Error duplicating game state:', error);
        this.showError('Error al duplicar el estado de juego');
      }
    });
  }

  toggleStatus(state: GameState): void {
    if (state.id) {
      const updateData: UpdateGameStateDto = {
        isActive: !state.isActive
      };
      
      this.competenciesService.updateGameState(state.id, updateData).subscribe({
        next: () => {
          this.showSuccess(`Estado ${state.isActive ? 'desactivado' : 'activado'} exitosamente`);
          this.loadGameStates();
        },
        error: (error) => {
          console.error('Error toggling state status:', error);
          this.showError('Error al cambiar el estado');
        }
      });
    }
  }

  selectGameState(state: GameState): void {
    console.log('Selected game state:', state);
  }

  viewDetails(state: GameState): void {
    this.showInfo(`Estado: ${state.name}`);
  }

  refreshData(): void {
    this.loadGameStates();
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
