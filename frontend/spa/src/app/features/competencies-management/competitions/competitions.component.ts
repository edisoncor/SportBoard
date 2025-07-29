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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { Competition, CreateCompetitionDto, UpdateCompetitionDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de competencias deportivas
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-competitions',
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
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="competitions-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">emoji_events</mat-icon>
            Competencias Deportivas
          </h1>
          <p class="page-subtitle">Administre las competencias del sistema deportivo</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nueva Competencia
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
            <mat-icon class="stat-icon">emoji_events</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ competitions.length }}</span>
              <span class="stat-label">Total Competencias</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">business</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ uniqueAdministrations }}</span>
              <span class="stat-label">Administraciones</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">calendar_today</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ recentCompetitions }}</span>
              <span class="stat-label">Nuevas (30 días)</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">trending_up</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeCompetitions }}</span>
              <span class="stat-label">En Curso</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingCompetition ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingCompetition ? 'Editar' : 'Crear' }} Competencia
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="competitionForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información de la Competencia
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Competencia</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Copa América 2024">
                  <mat-icon matSuffix>emoji_events</mat-icon>
                  <mat-error *ngIf="competitionForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                  <mat-error *ngIf="competitionForm.get('name')?.hasError('maxlength')">
                    Máximo 200 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Administración Responsable</mat-label>
                  <mat-select formControlName="administration">
                    <mat-option value="">Seleccione una administración</mat-option>
                    <mat-option value="1">Administración 1</mat-option>
                    <mat-option value="2">Administración 2</mat-option>
                    <mat-option value="3">Administración 3</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>business</mat-icon>
                  <mat-error *ngIf="competitionForm.get('administration')?.hasError('required')">
                    La administración es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Creación</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="creationDate">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-hint>Fecha oficial de creación de la competencia</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>sports</mat-icon>
                Detalles Adicionales
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Tipo de Competencia</mat-label>
                  <mat-select formControlName="competitionType">
                    <mat-option value="tournament">Torneo</mat-option>
                    <mat-option value="league">Liga</mat-option>
                    <mat-option value="cup">Copa</mat-option>
                    <mat-option value="championship">Campeonato</mat-option>
                    <mat-option value="friendly">Amistoso</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>category</mat-icon>
                  <mat-hint>Tipo de formato de la competencia</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nivel de Competencia</mat-label>
                  <mat-select formControlName="level">
                    <mat-option value="international">Internacional</mat-option>
                    <mat-option value="national">Nacional</mat-option>
                    <mat-option value="regional">Regional</mat-option>
                    <mat-option value="local">Local</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>public</mat-icon>
                  <mat-hint>Alcance geográfico de la competencia</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="competitionForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingCompetition ? 'save' : 'add_circle' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingCompetition ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>emoji_events</mat-icon>
            Lista de Competencias
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar competencias</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, administración...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando competencias...</p>
          </div>

          <div *ngIf="!loading && competitions.length === 0" class="empty-state">
            <mat-icon class="empty-icon">emoji_events</mat-icon>
            <h3>No hay competencias registradas</h3>
            <p>Comience agregando su primera competencia deportiva</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Competencia
            </button>
          </div>

          <div *ngIf="!loading && competitions.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let competition">
                  <div class="competition-id">
                    <div class="competition-icon">
                      <mat-icon>emoji_events</mat-icon>
                    </div>
                    <span class="id-number">{{ competition.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Competencia -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Competencia</th>
                <td mat-cell *matCellDef="let competition">
                  <div class="competition-info">
                    <div class="competition-name">{{ competition.name }}</div>
                    <div class="competition-details">
                      <mat-icon class="detail-icon">sports</mat-icon>
                      {{ getCompetitionType(competition) }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Administración -->
              <ng-container matColumnDef="administration">
                <th mat-header-cell *matHeaderCellDef>Administración</th>
                <td mat-cell *matCellDef="let competition">
                  <div class="administration-info">
                    <mat-chip class="administration-chip">
                      <mat-icon>business</mat-icon>
                      {{ getAdministrationName(competition.administration) }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nivel -->
              <ng-container matColumnDef="level">
                <th mat-header-cell *matHeaderCellDef>Nivel</th>
                <td mat-cell *matCellDef="let competition">
                  <mat-chip class="level-chip" [class]="getLevelClass(competition.level)">
                    <mat-icon>{{ getLevelIcon(competition.level) }}</mat-icon>
                    {{ getLevelDisplay(competition.level) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let competition">
                  <div class="dates-info">
                    <div class="creation-date" *ngIf="competition.creationDate">
                      <mat-icon class="date-icon">event</mat-icon>
                      {{ competition.creationDate | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="created-date">
                      <mat-icon class="date-icon">schedule</mat-icon>
                      {{ competition.createdAt | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let competition">
                  <mat-chip class="status-chip" [class]="getStatusClass(competition.status)">
                    <mat-icon>{{ getStatusIcon(competition.status) }}</mat-icon>
                    {{ getStatusDisplay(competition.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let competition">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editCompetition(competition)" 
                            matTooltip="Editar competencia">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(competition)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="manageSeasons(competition)">
                        <mat-icon>calendar_view_month</mat-icon>
                        Gestionar temporadas
                      </button>
                      <button mat-menu-item (click)="duplicateCompetition(competition)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="exportCompetition(competition)">
                        <mat-icon>download</mat-icon>
                        Exportar datos
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteCompetition(competition)" class="delete-action">
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
                  (click)="selectCompetition(row)"></tr>
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
    .competitions-container {
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
      background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
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
      max-height: 700px;
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
      color: #ff9800;
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

    .competition-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .competition-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff3e0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff9800;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .competition-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .competition-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .competition-details {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #666;
    }

    .detail-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .administration-info {
      display: flex;
      align-items: center;
    }

    .administration-chip {
      background: #e3f2fd;
      color: #1976d2;
      font-size: 0.8rem;
    }

    .level-chip {
      font-size: 0.8rem;
    }

    .level-chip.international {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .level-chip.national {
      background: #e3f2fd;
      color: #1976d2;
    }

    .level-chip.regional {
      background: #fff3e0;
      color: #f57c00;
    }

    .level-chip.local {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-chip.planned {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-chip.finished {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .status-chip.cancelled {
      background: #ffebee;
      color: #d32f2f;
    }

    .dates-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .creation-date,
    .created-date {
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
      .competitions-container {
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
export class CompetitionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  competitions: Competition[] = [];
  dataSource = new MatTableDataSource<Competition>([]);
  competitionForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'administration', 'level', 'dates', 'status', 'actions'];
  loading = false;
  showForm = false;
  editingCompetition: Competition | null = null;
  uniqueAdministrations = 0;
  recentCompetitions = 0;
  activeCompetitions = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.competitionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      administration: ['', [Validators.required]],
      creationDate: [''],
      competitionType: ['tournament'],
      level: ['national']
    });
  }

  ngOnInit(): void {
    this.loadCompetitions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCompetitions(): void {
    this.loading = true;
    this.competenciesService.getCompetitions().subscribe({
      next: (competitions) => {
        this.competitions = competitions;
        this.dataSource.data = competitions;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competitions:', error);
        this.showError('Error al cargar las competencias');
        this.loading = false;
        // Comentamos showMockData para usar solo datos reales
        // this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockCompetitions: any[] = [
      {
        id: 1,
        name: 'Copa América 2024',
        administration: 1,
        creationDate: new Date('2024-01-15'),
        competitionType: 'cup',
        level: 'international',
        status: 'active',
        createdAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        id: 2,
        name: 'Liga Colombiana de Fútbol',
        administration: 1,
        creationDate: new Date('2024-02-01'),
        competitionType: 'league',
        level: 'national',
        status: 'active',
        createdAt: new Date('2024-02-01T10:00:00Z')
      },
      {
        id: 3,
        name: 'Torneo Regional de Baloncesto',
        administration: 2,
        creationDate: new Date('2024-03-01'),
        competitionType: 'tournament',
        level: 'regional',
        status: 'planned',
        createdAt: new Date('2024-03-01T10:00:00Z')
      },
      {
        id: 4,
        name: 'Campeonato Sudamericano de Tenis',
        administration: 3,
        creationDate: new Date('2024-04-01'),
        competitionType: 'championship',
        level: 'international',
        status: 'finished',
        createdAt: new Date('2024-04-01T10:00:00Z')
      },
      {
        id: 5,
        name: 'Liga Local de Volleyball',
        administration: 5,
        creationDate: new Date('2024-05-01'),
        competitionType: 'league',
        level: 'local',
        status: 'active',
        createdAt: new Date('2024-05-01T10:00:00Z')
      }
    ];
    this.competitions = mockCompetitions;
    this.dataSource.data = mockCompetitions;
    this.calculateStats();
  }

  calculateStats(): void {
    this.uniqueAdministrations = new Set(this.competitions.map(c => c.administration)).size;
    this.activeCompetitions = this.competitions.filter((c: any) => c.status === 'active').length;
    
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    this.recentCompetitions = this.competitions.filter(c => 
      c.createdAt && new Date(c.createdAt) > monthAgo
    ).length;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingCompetition = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingCompetition = null;
    this.resetForm();
  }

  resetForm(): void {
    this.competitionForm.reset({
      competitionType: 'tournament',
      level: 'national'
    });
    this.editingCompetition = null;
  }

  private extractIdFromUrl(url: string): number {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private transformFormData(formData: any): any {
    console.log('🏆 Raw competition form data:', formData);
    
    const transformedData = { ...formData };
    
    // Transformar administration ID a URL completa
    if (transformedData.administration && typeof transformedData.administration === 'string') {
      const adminId = parseInt(transformedData.administration);
      if (!isNaN(adminId)) {
        transformedData.administration = `http://localhost/api/v1/competencies/administrations/${adminId}/`;
      }
    }
    
    // Remover campos vacíos o no requeridos para creación
    if (!transformedData.creationDate || transformedData.creationDate === '') {
      delete transformedData.creationDate;
    }
    if (!transformedData.competitionType || transformedData.competitionType === '') {
      delete transformedData.competitionType;
    }
    if (!transformedData.level || transformedData.level === '') {
      delete transformedData.level;
    }
    
    console.log('🔄 Transformed competition data:', transformedData);
    return transformedData;
  }

  onSubmit(): void {
    if (this.competitionForm.valid) {
      this.loading = true;
      const rawFormData = this.competitionForm.value;
      const transformedData = this.transformFormData(rawFormData);

      console.log('🚀 Sending competition data:', JSON.stringify(transformedData, null, 2));

      if (this.editingCompetition) {
        this.updateCompetition(transformedData);
      } else {
        this.createCompetition(transformedData);
      }
    }
  }

  createCompetition(data: CreateCompetitionDto): void {
    this.competenciesService.createCompetition(data).subscribe({
      next: (competition) => {
        this.showSuccess('Competencia creada exitosamente');
        this.loadCompetitions();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating competition:', error);
        this.showError('Error al crear la competencia');
        this.loading = false;
      }
    });
  }

  updateCompetition(data: UpdateCompetitionDto): void {
    if (this.editingCompetition?.id) {
      this.competenciesService.updateCompetition(this.editingCompetition.id, data).subscribe({
        next: (competition) => {
          this.showSuccess('Competencia actualizada exitosamente');
          this.loadCompetitions();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating competition:', error);
          this.showError('Error al actualizar la competencia');
          this.loading = false;
        }
      });
    }
  }

  editCompetition(competition: Competition): void {
    this.editingCompetition = competition;
    
    // Extraer ID de administration
    let administrationValue: string;
    const admin = competition.administration as any;
    
    if (admin && typeof admin === 'string') {
      if (admin.indexOf('http') !== -1) {
        // Es una URL, extraer el ID
        administrationValue = this.extractIdFromUrl(admin).toString();
      } else {
        // Ya es un ID como string
        administrationValue = admin;
      }
    } else if (typeof admin === 'number') {
      // Es un número, convertir a string
      administrationValue = admin.toString();
    } else if (admin && admin.id) {
      // Es un objeto Administration, usar su ID
      administrationValue = admin.id.toString();
    } else {
      // Valor por defecto
      administrationValue = '1';
    }
    
    this.competitionForm.patchValue({
      name: competition.name,
      administration: administrationValue,
      creationDate: (competition as any).creationDate,
      competitionType: (competition as any).competitionType || 'tournament',
      level: (competition as any).level || 'national'
    });
    this.showForm = true;
  }

  deleteCompetition(competition: Competition): void {
    if (confirm(`¿Está seguro que desea eliminar la competencia "${competition.name}"?`)) {
      if (competition.id) {
        this.competenciesService.deleteCompetition(competition.id).subscribe({
          next: () => {
            this.showSuccess('Competencia eliminada exitosamente');
            this.loadCompetitions();
          },
          error: (error) => {
            console.error('Error deleting competition:', error);
            this.showError('Error al eliminar la competencia');
          }
        });
      }
    }
  }

  duplicateCompetition(competition: Competition): void {
    const duplicatedCompetition: CreateCompetitionDto = {
      name: `${competition.name} (Copia)`,
      administration: typeof competition.administration === 'number' 
        ? competition.administration 
        : competition.administration.id || 1
    };
    
    this.competenciesService.createCompetition(duplicatedCompetition).subscribe({
      next: () => {
        this.showSuccess('Competencia duplicada exitosamente');
        this.loadCompetitions();
      },
      error: (error) => {
        console.error('Error duplicating competition:', error);
        this.showError('Error al duplicar la competencia');
      }
    });
  }

  selectCompetition(competition: Competition): void {
    console.log('Selected competition:', competition);
  }

  viewDetails(competition: Competition): void {
    this.showInfo(`Competencia: ${competition.name}`);
  }

  manageSeasons(competition: Competition): void {
    this.showInfo(`Gestionar temporadas para: ${competition.name}`);
  }

  exportCompetition(competition: Competition): void {
    this.showInfo(`Exportando datos de: ${competition.name}`);
  }

  refreshData(): void {
    this.loadCompetitions();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCompetitionType(competition: any): string {
    const types: { [key: string]: string } = {
      tournament: 'Torneo',
      league: 'Liga',
      cup: 'Copa',
      championship: 'Campeonato',
      friendly: 'Amistoso'
    };
    return types[competition.competitionType] || 'Competencia deportiva';
  }

  getAdministrationName(administrationId: number | any): string {
    if (typeof administrationId === 'object') {
      return administrationId.name || 'Administración personalizada';
    }

    const administrations: { [key: number]: string } = {
      1: 'Federación Colombiana de Fútbol',
      2: 'Liga de Baloncesto de Medellín',
      3: 'Asociación de Tenis de Buenos Aires',
      4: 'Club de Natación São Paulo',
      5: 'Federación Peruana de Volleyball',
      6: 'Liga Mexicana de Béisbol',
      7: 'Confederación Sudamericana',
      8: 'Federación Internacional'
    };
    return administrations[administrationId] || 'Administración desconocida';
  }

  getLevelClass(level: string): string {
    return level || 'national';
  }

  getLevelIcon(level: string): string {
    const icons: { [key: string]: string } = {
      international: 'public',
      national: 'flag',
      regional: 'map',
      local: 'location_city'
    };
    return icons[level] || 'flag';
  }

  getLevelDisplay(level: string): string {
    const levels: { [key: string]: string } = {
      international: 'Internacional',
      national: 'Nacional',
      regional: 'Regional',
      local: 'Local'
    };
    return levels[level] || 'Nacional';
  }

  getStatusClass(status: string): string {
    return status || 'planned';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      active: 'play_circle',
      planned: 'schedule',
      finished: 'check_circle',
      cancelled: 'cancel'
    };
    return icons[status] || 'schedule';
  }

  getStatusDisplay(status: string): string {
    const statuses: { [key: string]: string } = {
      active: 'En Curso',
      planned: 'Planificada',
      finished: 'Finalizada',
      cancelled: 'Cancelada'
    };
    return statuses[status] || 'Planificada';
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
