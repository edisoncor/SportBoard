import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

import { Phase } from '../../../core/models/competencies/Phase';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

// Interfaz extendida para el componente con propiedades adicionales para la UI
interface PhaseDisplay extends Phase {
  type?: string;
  status?: 'planned' | 'active' | 'completed' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  order?: number;
  competitionId?: number;
}

@Component({
  selector: 'app-phases',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDividerModule
  ],
  template: `
    <div class="phases-container">
      <!-- Encabezado principal -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">timeline</mat-icon>
            Gestión de Fases
          </h1>
          <p class="page-subtitle">Administre las fases y etapas de las competencias deportivas</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nueva Fase
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
            <mat-icon class="stat-icon">timeline</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ totalPhases }}</span>
              <span class="stat-label">Total Fases</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">play_circle_filled</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activePhases }}</span>
              <span class="stat-label">En Progreso</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ completedPhases }}</span>
              <span class="stat-label">Completadas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">event</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ upcomingPhases }}</span>
              <span class="stat-label">Próximas</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario expandible -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingPhase ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingPhase ? 'Editar Fase' : 'Nueva Fase' }}
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideForm()" matTooltip="Cerrar formulario">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>

        <mat-card-content *ngIf="showForm" class="modern-form">
          <form [formGroup]="phaseForm" (ngSubmit)="savePhase()">
            
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información Básica
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Fase</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Fase de Grupos">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-error *ngIf="phaseForm.get('name')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Tipo de Fase</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="group">Fase de Grupos</mat-option>
                    <mat-option value="elimination">Eliminación Directa</mat-option>
                    <mat-option value="round_robin">Round Robin</mat-option>
                    <mat-option value="playoff">Playoff</mat-option>
                    <mat-option value="final">Final</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>category</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" rows="3" 
                           placeholder="Descripción detallada de la fase"></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Orden</mat-label>
                  <input matInput type="number" formControlName="order" 
                         placeholder="Orden de ejecución">
                  <mat-icon matSuffix>sort</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Fechas y cronograma -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>schedule</mat-icon>
                Cronograma
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Inicio</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Fin</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Estado</mat-label>
                  <mat-select formControlName="status">
                    <mat-option value="planned">Planificada</mat-option>
                    <mat-option value="active">En Progreso</mat-option>
                    <mat-option value="completed">Completada</mat-option>
                    <mat-option value="cancelled">Cancelada</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flag</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Competencia Asociada</mat-label>
                  <mat-select formControlName="competitionId">
                    <mat-option value="1">Liga Nacional 2024</mat-option>
                    <mat-option value="2">Copa Regional</mat-option>
                    <mat-option value="3">Torneo Juvenil</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>sports_soccer</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Acciones del formulario -->
            <div class="form-actions-row">
              <button type="button" mat-button (click)="resetForm()">
                <mat-icon>clear</mat-icon>
                Limpiar
              </button>
              <button type="button" mat-stroked-button (click)="hideForm()">
                Cancelar
              </button>
              <button type="submit" mat-raised-button color="primary" 
                      [disabled]="!phaseForm.valid || saving" class="submit-btn">
                <mat-icon>{{ editingPhase ? 'save' : 'add' }}</mat-icon>
                {{ editingPhase ? 'Guardar Cambios' : 'Crear Fase' }}
                <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de datos -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>list</mat-icon>
            Lista de Fases
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar fases</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, tipo...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando fases...</p>
          </div>

          <div *ngIf="!loading && phases.length === 0" class="empty-state">
            <mat-icon class="empty-icon">timeline</mat-icon>
            <h3>No hay fases registradas</h3>
            <p>Comience agregando su primera fase de competencia</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Fase
            </button>
          </div>

          <div *ngIf="!loading && phases.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let phase">
                  <div class="phase-id">
                    <div class="phase-icon">
                      <mat-icon>timeline</mat-icon>
                    </div>
                    <span class="id-number">{{ phase.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fase</th>
                <td mat-cell *matCellDef="let phase">
                  <div class="phase-info">
                    <div class="phase-name">{{ phase.name }}</div>
                    <div class="phase-order">Orden: {{ phase.order }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Tipo -->
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Tipo</th>
                <td mat-cell *matCellDef="let phase">
                  <mat-chip class="type-chip" [class]="getTypeClass(phase.type)">
                    <mat-icon>{{ getTypeIcon(phase.type) }}</mat-icon>
                    {{ getTypeDisplay(phase.type) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Cronograma</th>
                <td mat-cell *matCellDef="let phase">
                  <div class="date-info">
                    <div class="date-range">
                      <mat-icon>event</mat-icon>
                      {{ formatDate(phase.startDate) }} - {{ formatDate(phase.endDate) }}
                    </div>
                    <div class="duration">{{ calculateDuration(phase) }} días</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                <td mat-cell *matCellDef="let phase">
                  <mat-chip class="status-chip" [class]="getStatusClass(phase.status)">
                    <mat-icon>{{ getStatusIcon(phase.status) }}</mat-icon>
                    {{ getStatusDisplay(phase.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let phase">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editPhase(phase)" 
                            matTooltip="Editar fase">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(phase)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicatePhase(phase)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="changeStatus(phase)">
                        <mat-icon>flag</mat-icon>
                        Cambiar estado
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deletePhase(phase)" class="delete-action">
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
                  (click)="selectPhase(row)"></tr>
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
    .phases-container {
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
      color: #673ab7;
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
      background: linear-gradient(135deg, #673ab7 0%, #9c27b0 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
    }

    .stat-card:nth-child(4) {
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
      max-height: 800px;
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
      color: #673ab7;
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
      padding: 48px 24px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
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
      overflow: auto;
    }

    .modern-table {
      width: 100%;
      background: white;
    }

    .table-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f5f5f5;
    }

    .phase-id {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .phase-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #673ab7, #9c27b0);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .phase-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .id-number {
      font-weight: bold;
      color: #673ab7;
    }

    .phase-info {
      display: flex;
      flex-direction: column;
    }

    .phase-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .phase-order {
      font-size: 0.8rem;
      color: #666;
    }

    .type-chip {
      font-size: 0.8rem;
    }

    .type-chip.group {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-chip.elimination {
      background-color: #fce4ec;
      color: #c2185b;
    }

    .type-chip.round_robin {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .type-chip.playoff {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .type-chip.final {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .date-info {
      display: flex;
      flex-direction: column;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
    }

    .duration {
      font-size: 0.8rem;
      color: #666;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.planned {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-chip.active {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-chip.completed {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-chip.cancelled {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .phases-container {
        padding: 16px;
      }

      .header-section {
        flex-direction: column;
        gap: 16px;
      }

      .stats-row {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .search-field {
        width: 100%;
      }

      .table-container {
        overflow-x: auto;
      }
    }
  `]
})
export class PhasesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phases: PhaseDisplay[] = [];
  dataSource = new MatTableDataSource<PhaseDisplay>([]);
  phaseForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'type', 'dates', 'status', 'actions'];
  loading = false;
  saving = false;
  showForm = false;
  editingPhase: PhaseDisplay | null = null;
  totalPhases = 0;
  activePhases = 0;
  completedPhases = 0;
  upcomingPhases = 0;

  mockPhases: PhaseDisplay[] = [
    {
      id: 1,
      name: 'Fase de Grupos',
      description: 'Primera fase con grupos de 4 equipos cada uno',
      modality: 1,
      season: 1,
      category: 1,
      isActive: false,
      type: 'group',
      order: 1,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-15'),
      status: 'completed',
      competitionId: 1
    },
    {
      id: 2,
      name: 'Octavos de Final',
      description: 'Eliminación directa - Octavos de final',
      modality: 2,
      season: 1,
      category: 1,
      isActive: true,
      type: 'elimination',
      order: 2,
      startDate: new Date('2024-03-18'),
      endDate: new Date('2024-03-25'),
      status: 'active',
      competitionId: 1
    },
    {
      id: 3,
      name: 'Cuartos de Final',
      description: 'Eliminación directa - Cuartos de final',
      modality: 2,
      season: 1,
      category: 1,
      isActive: true,
      type: 'elimination',
      order: 3,
      startDate: new Date('2024-03-28'),
      endDate: new Date('2024-04-01'),
      status: 'planned',
      competitionId: 1
    },
    {
      id: 4,
      name: 'Semifinales',
      description: 'Semifinales del torneo',
      modality: 2,
      season: 1,
      category: 1,
      isActive: true,
      type: 'elimination',
      order: 4,
      startDate: new Date('2024-04-05'),
      endDate: new Date('2024-04-08'),
      status: 'planned',
      competitionId: 1
    },
    {
      id: 5,
      name: 'Final',
      description: 'Partido final del campeonato',
      modality: 3,
      season: 1,
      category: 1,
      isActive: true,
      type: 'final',
      order: 5,
      startDate: new Date('2024-04-12'),
      endDate: new Date('2024-04-12'),
      status: 'planned',
      competitionId: 1
    }
  ];

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.phaseForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', [Validators.required]],
      description: [''],
      order: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      status: ['planned', [Validators.required]],
      competitionId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPhases();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPhases(): void {
    this.loading = true;
    this.competenciesService.getPhases().subscribe({
      next: (phases) => {
        this.phases = phases;
        this.dataSource.data = this.phases;
        this.totalPhases = this.phases.length;
        this.activePhases = this.phases.filter(p => p.status === 'active').length;
        this.completedPhases = this.phases.filter(p => p.status === 'completed').length;
        this.upcomingPhases = this.phases.filter(p => p.status === 'planned').length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading phases:', error);
        this.snackBar.open('Error al cargar las fases', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingPhase = null;
    this.resetForm();
  }

  hideForm(): void {
    this.showForm = false;
    this.editingPhase = null;
  }

  resetForm(): void {
    this.phaseForm.reset({
      status: 'planned'
    });
  }

  private extractIdFromUrl(url: string): number {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private transformFormData(formData: any): any {
    console.log('🏁 Raw phase form data:', formData);
    
    // Solo enviar los campos que espera el backend según el modelo Phase
    const transformedData = {
      name: formData.name?.trim() || '',
      description: formData.description?.trim() || formData.name?.trim() || 'Descripción de la fase',
      modality: `http://localhost/api/v1/competencies/catalogues/1/`, // URL del catálogo
      season: `http://localhost/api/v1/competencies/seasons/1/`, // URL de la temporada
      category: `http://localhost/api/v1/competencies/categories/1/`, // URL de la categoría
      isActive: formData.status === 'active' || formData.status === 'planned' // Mapear status a isActive
    };
    
    console.log('🔄 Transformed phase data:', transformedData);
    return transformedData;
  }

  savePhase(): void {
    if (this.phaseForm.valid) {
      this.saving = true;
      const rawFormData = this.phaseForm.value;
      const transformedData = this.transformFormData(rawFormData);

      console.log('🚀 Sending phase data:', JSON.stringify(transformedData, null, 2));

      if (this.editingPhase && this.editingPhase.id) {
        // Actualizar fase existente
        this.competenciesService.updatePhase(this.editingPhase.id, transformedData).subscribe({
          next: (updatedPhase) => {
            this.showSuccess('Fase actualizada exitosamente');
            this.saving = false;
            this.hideForm();
            this.loadPhases();
          },
          error: (error) => {
            console.error('Error updating phase:', error);
            this.snackBar.open('Error al actualizar la fase', 'Cerrar', { duration: 3000 });
            this.saving = false;
          }
        });
      } else {
        // Crear nueva fase
        this.competenciesService.createPhase(transformedData).subscribe({
          next: (newPhase) => {
            this.showSuccess('Fase creada exitosamente');
            this.saving = false;
            this.hideForm();
            this.loadPhases();
          },
          error: (error) => {
            console.error('Error creating phase:', error);
            this.snackBar.open('Error al crear la fase', 'Cerrar', { duration: 3000 });
            this.saving = false;
          }
        });
      }
    }
  }

  editPhase(phase: PhaseDisplay): void {
    this.editingPhase = phase;
    this.phaseForm.patchValue(phase);
    this.showForm = true;
  }

  deletePhase(phase: PhaseDisplay): void {
    if (confirm(`¿Está seguro que desea eliminar la fase "${phase.name}"?`)) {
      if (phase.id) {
        this.competenciesService.deletePhase(phase.id).subscribe({
          next: () => {
            this.showSuccess('Fase eliminada exitosamente');
            this.loadPhases();
          },
          error: (error) => {
            console.error('Error deleting phase:', error);
            this.snackBar.open('Error al eliminar la fase', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  duplicatePhase(phase: PhaseDisplay): void {
    const duplicatedPhase: PhaseDisplay = {
      ...phase,
      id: this.phases.length + 1,
      name: `${phase.name} (Copia)`,
      status: 'planned'
    };
    this.phases.push(duplicatedPhase);
    this.dataSource.data = this.phases;
    this.showSuccess('Fase duplicada exitosamente');
  }

  changeStatus(phase: PhaseDisplay): void {
    // Implementar lógica de cambio de estado
    this.showInfo('Funcionalidad de cambio de estado próximamente');
  }

  viewDetails(phase: PhaseDisplay): void {
    this.showInfo(`Detalles de la fase: ${phase.name}`);
  }

  selectPhase(phase: PhaseDisplay): void {
    console.log('Selected phase:', phase);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadPhases();
    this.showSuccess('Datos actualizados');
  }

  // Métodos de utilidad para el template
  getTypeClass(type: string): string {
    return type;
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'group': 'groups',
      'elimination': 'sports_mma',
      'round_robin': 'loop',
      'playoff': 'emoji_events',
      'final': 'star'
    };
    return icons[type] || 'timeline';
  }

  getTypeDisplay(type: string): string {
    const displays: { [key: string]: string } = {
      'group': 'Grupos',
      'elimination': 'Eliminación',
      'round_robin': 'Round Robin',
      'playoff': 'Playoff',
      'final': 'Final'
    };
    return displays[type] || type;
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'planned': 'event',
      'active': 'play_circle_filled',
      'completed': 'check_circle',
      'cancelled': 'cancel'
    };
    return icons[status] || 'flag';
  }

  getStatusDisplay(status: string): string {
    const displays: { [key: string]: string } = {
      'planned': 'Planificada',
      'active': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return displays[status] || status;
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'Fecha inválida';
      return dateObj.toLocaleDateString('es-ES');
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  calculateDuration(phase: PhaseDisplay): number {
    if (!phase.startDate || !phase.endDate) return 0;
    const startTime = new Date(phase.startDate).getTime();
    const endTime = new Date(phase.endDate).getTime();
    return Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
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
