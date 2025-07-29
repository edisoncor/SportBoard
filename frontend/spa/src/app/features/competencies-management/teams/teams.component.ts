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
import { Team, CreateTeamDto, UpdateTeamDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de equipos deportivos
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-teams',
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
    <div class="teams-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">groups</mat-icon>
            Equipos Deportivos
          </h1>
          <p class="page-subtitle">Administre los equipos participantes en las competencias</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>group_add</mat-icon>
            Nuevo Equipo
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
            <mat-icon class="stat-icon">groups</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ teams.length }}</span>
              <span class="stat-label">Total Equipos</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">flag</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ uniqueNationalities }}</span>
              <span class="stat-label">Nacionalidades</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">category</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ uniqueCategories }}</span>
              <span class="stat-label">Categorías</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">trending_up</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ recentTeams }}</span>
              <span class="stat-label">Nuevos (7 días)</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingTeam ? 'edit' : 'group_add' }}</mat-icon>
            {{ editingTeam ? 'Editar' : 'Crear' }} Equipo
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="teamForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información del Equipo
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre del Equipo</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Real Madrid CF">
                  <mat-icon matSuffix>groups</mat-icon>
                  <mat-error *ngIf="teamForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                  <mat-error *ngIf="teamForm.get('name')?.hasError('maxlength')">
                    Máximo 100 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nacionalidad</mat-label>
                  <mat-select formControlName="nationality">
                    <mat-option value="2">Estados Unidos</mat-option>
                    <mat-option value="3">New York City (como nacionalidad)</mat-option>
                    <mat-option value="1">Forward Position (como nacionalidad)</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flag</mat-icon>
                  <mat-error *ngIf="teamForm.get('nationality')?.hasError('required')">
                    La nacionalidad es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Categoría</mat-label>
                  <mat-select formControlName="category">
                    <mat-option value="">Sin categoría específica</mat-option>
                    <mat-option value="1">Juvenil (Sub-18)</mat-option>
                    <mat-option value="2">Senior (Adultos)</mat-option>
                    <mat-option value="3">Veteranos (+35)</mat-option>
                    <mat-option value="4">Femenino</mat-option>
                    <mat-option value="5">Masculino</mat-option>
                    <mat-option value="6">Mixto</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>category</mat-icon>
                  <mat-hint>Opcional: Seleccione la categoría del equipo</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="teamForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingTeam ? 'save' : 'group_add' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingTeam ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>groups</mat-icon>
            Lista de Equipos
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar equipos</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, nacionalidad...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando equipos...</p>
          </div>

          <div *ngIf="!loading && teams.length === 0" class="empty-state">
            <mat-icon class="empty-icon">groups</mat-icon>
            <h3>No hay equipos registrados</h3>
            <p>Comience agregando su primer equipo deportivo</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>group_add</mat-icon>
              Agregar Equipo
            </button>
          </div>

          <div *ngIf="!loading && teams.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let team">
                  <div class="team-id">
                    <div class="team-icon">
                      <mat-icon>groups</mat-icon>
                    </div>
                    <span class="id-number">{{ team.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Equipo -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Equipo</th>
                <td mat-cell *matCellDef="let team">
                  <div class="team-info">
                    <div class="team-name">{{ team.name }}</div>
                    <div class="team-details">
                      <mat-icon class="detail-icon">sports_soccer</mat-icon>
                      Equipo deportivo
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nacionalidad -->
              <ng-container matColumnDef="nationality">
                <th mat-header-cell *matHeaderCellDef>Nacionalidad</th>
                <td mat-cell *matCellDef="let team">
                  <div class="nationality-info">
                    <mat-chip class="nationality-chip">
                      <mat-icon>flag</mat-icon>
                      {{ getNationalityName(team.nationality) }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Categoría -->
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Categoría</th>
                <td mat-cell *matCellDef="let team">
                  <div class="category-info">
                    <mat-chip class="category-chip" *ngIf="team.category; else noCategory">
                      <mat-icon>category</mat-icon>
                      {{ getCategoryName(team.category) }}
                    </mat-chip>
                    <ng-template #noCategory>
                      <span class="no-category">Sin categoría</span>
                    </ng-template>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let team">
                  <div class="dates-info">
                    <div class="created-date">
                      <mat-icon class="date-icon">schedule</mat-icon>
                      {{ team.createdAt | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="updated-date" *ngIf="team.updatedAt">
                      <mat-icon class="date-icon">update</mat-icon>
                      {{ team.updatedAt | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let team">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editTeam(team)" 
                            matTooltip="Editar equipo">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(team)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateTeam(team)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="viewPlayers(team)">
                        <mat-icon>people</mat-icon>
                        Ver jugadores
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteTeam(team)" class="delete-action">
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
                  (click)="selectTeam(row)"></tr>
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
    .teams-container {
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
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
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
      color: #4caf50;
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

    .team-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .team-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e8f5e8;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4caf50;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .team-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .team-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .team-details {
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

    .nationality-info {
      display: flex;
      align-items: center;
    }

    .nationality-chip {
      background: #fff3e0;
      color: #f57c00;
      font-size: 0.8rem;
    }

    .category-info {
      display: flex;
      align-items: center;
    }

    .category-chip {
      background: #f3e5f5;
      color: #7b1fa2;
      font-size: 0.8rem;
    }

    .no-category {
      color: #999;
      font-style: italic;
      font-size: 0.8rem;
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
      .teams-container {
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
export class TeamsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  teams: Team[] = [];
  dataSource = new MatTableDataSource<Team>([]);
  teamForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'nationality', 'category', 'dates', 'actions'];
  loading = false;
  showForm = false;
  editingTeam: Team | null = null;
  uniqueNationalities = 0;
  uniqueCategories = 0;
  recentTeams = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.teamForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      nationality: ['', [Validators.required]],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadTeams();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTeams(): void {
    this.loading = true;
    this.competenciesService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.dataSource.data = teams;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.showError('Error al cargar los equipos');
        this.loading = false;
        // Comentamos showMockData para usar solo datos reales
        // this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockTeams: Team[] = [
      {
        id: 1,
        name: 'Real Madrid CF',
        nationality: 11, // España
        category: 2, // Senior
        createdAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        id: 2,
        name: 'FC Barcelona',
        nationality: 11, // España
        category: 2, // Senior
        createdAt: new Date('2024-01-16T10:00:00Z')
      },
      {
        id: 3,
        name: 'Boca Juniors',
        nationality: 2, // Argentina
        category: 2, // Senior
        createdAt: new Date('2024-01-17T10:00:00Z')
      },
      {
        id: 4,
        name: 'Flamengo',
        nationality: 3, // Brasil
        category: 2, // Senior
        createdAt: new Date('2024-01-18T10:00:00Z')
      },
      {
        id: 5,
        name: 'Millonarios FC',
        nationality: 1, // Colombia
        category: 2, // Senior
        createdAt: new Date('2024-01-19T10:00:00Z')
      },
      {
        id: 6,
        name: 'Real Madrid Juvenil',
        nationality: 11, // España
        category: 1, // Juvenil
        createdAt: new Date('2024-01-20T10:00:00Z')
      },
      {
        id: 7,
        name: 'River Plate Femenino',
        nationality: 2, // Argentina
        category: 4, // Femenino
        createdAt: new Date('2024-01-21T10:00:00Z')
      }
    ];
    this.teams = mockTeams;
    this.dataSource.data = mockTeams;
    this.calculateStats();
  }

  calculateStats(): void {
    // Usar valores por defecto si las propiedades no existen
    this.uniqueNationalities = new Set(this.teams.map(t => t.nationality ?? 'Sin definir')).size;
    this.uniqueCategories = new Set(this.teams.filter(t => t.category).map(t => t.category ?? 'General')).size;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.recentTeams = this.teams.filter(t => 
      t.createdAt && new Date(t.createdAt) > weekAgo
    ).length;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingTeam = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingTeam = null;
    this.resetForm();
  }

  resetForm(): void {
    this.teamForm.reset();
    this.editingTeam = null;
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      this.loading = true;
      const rawFormData = this.teamForm.value;
      console.log('🏈 Raw team form data:', rawFormData);
      
      const formData = this.transformFormData(rawFormData);
      console.log('🔄 Transformed team data:', formData);

      if (this.editingTeam) {
        this.updateTeam(formData);
      } else {
        this.createTeam(formData);
      }
    }
  }

  /**
   * Transforma los datos del formulario para limpiar campos vacíos o inválidos
   */
  private transformFormData(formData: any): any {
    const transformed: any = {
      name: formData.name,
      nationality: parseInt(formData.nationality, 10)
    };
    
    // Solo incluir category si tiene un valor válido
    if (formData.category && formData.category !== '' && formData.category !== 'null') {
      // Por ahora no incluir category ya que no hay categorías válidas en el backend
      // transformed.category = parseInt(formData.category, 10);
    }

    return transformed;
  }

  createTeam(data: CreateTeamDto): void {
    console.log('🚀 Sending team data:', JSON.stringify(data, null, 2));
    this.competenciesService.createTeam(data).subscribe({
      next: (team) => {
        this.showSuccess('Equipo creado exitosamente');
        this.loadTeams();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error creating team:', error);
        this.showError('Error al crear el equipo');
        this.loading = false;
      }
    });
  }

  updateTeam(data: UpdateTeamDto): void {
    if (this.editingTeam?.id) {
      this.competenciesService.updateTeam(this.editingTeam.id, data).subscribe({
        next: (team) => {
          this.showSuccess('Equipo actualizado exitosamente');
          this.loadTeams();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating team:', error);
          this.showError('Error al actualizar el equipo');
          this.loading = false;
        }
      });
    }
  }

  editTeam(team: Team): void {
    this.editingTeam = team;
    this.teamForm.patchValue({
      name: team.name,
      nationality: team.nationality.toString(),
      category: team.category?.toString() || ''
    });
    this.showForm = true;
  }

  deleteTeam(team: Team): void {
    if (confirm(`¿Está seguro que desea eliminar el equipo "${team.name}"?`)) {
      if (team.id) {
        this.competenciesService.deleteTeam(team.id).subscribe({
          next: () => {
            this.showSuccess('Equipo eliminado exitosamente');
            this.loadTeams();
          },
          error: (error) => {
            console.error('Error deleting team:', error);
            this.showError('Error al eliminar el equipo');
          }
        });
      }
    }
  }

  duplicateTeam(team: Team): void {
    const duplicatedTeam: CreateTeamDto = {
      name: `${team.name} (Copia)`,
      nationality: team.nationality,
      category: typeof team.category === 'number' ? team.category : undefined
    };
    
    this.competenciesService.createTeam(duplicatedTeam).subscribe({
      next: () => {
        this.showSuccess('Equipo duplicado exitosamente');
        this.loadTeams();
      },
      error: (error) => {
        console.error('Error duplicating team:', error);
        this.showError('Error al duplicar el equipo');
      }
    });
  }

  selectTeam(team: Team): void {
    console.log('Selected team:', team);
  }

  viewDetails(team: Team): void {
    this.showInfo(`Equipo: ${team.name} - Nacionalidad: ${this.getNationalityName(team.nationality)}`);
  }

  viewPlayers(team: Team): void {
    this.showInfo(`Funcionalidad de jugadores para: ${team.name}`);
  }

  refreshData(): void {
    this.loadTeams();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getNationalityName(nationalityId: number): string {
    const nationalities: { [key: number]: string } = {
      1: 'Colombia',
      2: 'Argentina',
      3: 'Brasil',
      4: 'Chile',
      5: 'Perú',
      6: 'Ecuador',
      7: 'Uruguay',
      8: 'Paraguay',
      9: 'Venezuela',
      10: 'Bolivia',
      11: 'España',
      12: 'Francia',
      13: 'Italia',
      14: 'Alemania',
      15: 'Inglaterra'
    };
    return nationalities[nationalityId] || 'Desconocida';
  }

  getCategoryName(categoryId: number | any): string {
    if (typeof categoryId === 'object') {
      return categoryId.name || 'Categoría personalizada';
    }
    
    const categories: { [key: number]: string } = {
      1: 'Juvenil (Sub-18)',
      2: 'Senior (Adultos)',
      3: 'Veteranos (+35)',
      4: 'Femenino',
      5: 'Masculino',
      6: 'Mixto'
    };
    return categories[categoryId] || 'Categoría personalizada';
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
