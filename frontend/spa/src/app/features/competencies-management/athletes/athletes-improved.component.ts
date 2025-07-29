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
import { Athlete, CreateAthleteDto, UpdateAthleteDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de atletas
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-athletes',
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
    <div class="athletes-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">sports</mat-icon>
            Gestión de Atletas
          </h1>
          <p class="page-subtitle">Administre los atletas del sistema deportivo</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>person_add</mat-icon>
            Nuevo Atleta
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
            <mat-icon class="stat-icon">group</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ athletes.length }}</span>
              <span class="stat-label">Total Atletas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">verified</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeAthletes }}</span>
              <span class="stat-label">Activos</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">sports_soccer</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ professionalAthletes }}</span>
              <span class="stat-label">Profesionales</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingAthlete ? 'edit' : 'person_add' }}</mat-icon>
            {{ editingAthlete ? 'Editar' : 'Crear' }} Atleta
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="athleteForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información personal -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>person</mat-icon>
                Información del Atleta
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>ID Usuario</mat-label>
                  <input matInput formControlName="user" type="number" placeholder="ID del usuario">
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="athleteForm.get('user')?.hasError('required')">
                    El usuario es obligatorio
                  </mat-error>
                  <mat-hint>ID del usuario asociado al atleta</mat-hint>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Altura (cm)</mat-label>
                  <input matInput formControlName="height" type="number" placeholder="180">
                  <mat-icon matSuffix>height</mat-icon>
                  <mat-hint>Altura en centímetros</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Peso (kg)</mat-label>
                  <input matInput formControlName="weight" type="number" placeholder="75">
                  <mat-icon matSuffix>monitor_weight</mat-icon>
                  <mat-hint>Peso en kilogramos</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <!-- Información deportiva -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>sports</mat-icon>
                Información Deportiva
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Posición</mat-label>
                  <mat-select formControlName="position">
                    <mat-option value="delantero">Delantero</mat-option>
                    <mat-option value="centrocampista">Centrocampista</mat-option>
                    <mat-option value="defensa">Defensa</mat-option>
                    <mat-option value="portero">Portero</mat-option>
                    <mat-option value="otro">Otro</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>sports_soccer</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Estado</mat-label>
                  <mat-select formControlName="isActive">
                    <mat-option [value]="true">Activo</mat-option>
                    <mat-option [value]="false">Inactivo</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>toggle_on</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="athleteForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingAthlete ? 'save' : 'person_add' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingAthlete ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>people</mat-icon>
            Lista de Atletas
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar atletas</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, email...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando atletas...</p>
          </div>

          <div *ngIf="!loading && athletes.length === 0" class="empty-state">
            <mat-icon class="empty-icon">sports</mat-icon>
            <h3>No hay atletas registrados</h3>
            <p>Comience agregando su primer atleta</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>person_add</mat-icon>
              Agregar Atleta
            </button>
          </div>

          <div *ngIf="!loading && athletes.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna Avatar/ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let athlete">
                  <div class="athlete-id">
                    <div class="athlete-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <span class="id-number">{{ athlete.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nombre/Usuario -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Usuario</th>
                <td mat-cell *matCellDef="let athlete">
                  <div class="athlete-info">
                    <div class="athlete-name">Usuario ID: {{ athlete.user }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Características -->
              <ng-container matColumnDef="characteristics">
                <th mat-header-cell *matHeaderCellDef>Características</th>
                <td mat-cell *matCellDef="let athlete">
                  <div class="characteristics">
                    <mat-chip class="characteristic-chip">
                      <mat-icon>height</mat-icon>
                      {{ athlete.height || 'N/A' }}cm
                    </mat-chip>
                    <mat-chip class="characteristic-chip">
                      <mat-icon>monitor_weight</mat-icon>
                      {{ athlete.weight || 'N/A' }}kg
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Posición -->
              <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef>Posición</th>
                <td mat-cell *matCellDef="let athlete">
                  <mat-chip class="position-chip" [class]="getPositionClass(athlete.position)">
                    <mat-icon>{{ getPositionIcon(athlete.position) }}</mat-icon>
                    {{ athlete.position || 'No definida' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let athlete">
                  <mat-chip class="status-chip active">
                    <mat-icon>verified</mat-icon>
                    Activo
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let athlete">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editAthlete(athlete)" 
                            matTooltip="Editar atleta">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewProfile(athlete)">
                        <mat-icon>person</mat-icon>
                        Ver perfil
                      </button>
                      <button mat-menu-item (click)="viewStatistics(athlete)">
                        <mat-icon>analytics</mat-icon>
                        Estadísticas
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteAthlete(athlete)" class="delete-action">
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
                  (click)="selectAthlete(row)"></tr>
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
    .athletes-container {
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
      background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #f57c00 0%, #ffb74d 100%);
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
      color: #1976d2;
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

    .athlete-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .athlete-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1976d2;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .athlete-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .athlete-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .athlete-date {
      font-size: 0.8rem;
      color: #666;
    }

    .characteristics {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .characteristic-chip {
      font-size: 0.75rem;
      background: #f5f5f5;
      color: #333;
    }

    .position-chip {
      font-size: 0.8rem;
    }

    .position-chip.delantero {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .position-chip.centrocampista {
      background: #fff3e0;
      color: #f57c00;
    }

    .position-chip.defensa {
      background: #e3f2fd;
      color: #1976d2;
    }

    .position-chip.portero {
      background: #fce4ec;
      color: #c2185b;
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
      .athletes-container {
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
export class AthletesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  athletes: Athlete[] = [];
  dataSource = new MatTableDataSource<Athlete>([]);
  athleteForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'characteristics', 'position', 'status', 'actions'];
  loading = false;
  showForm = false;
  editingAthlete: Athlete | null = null;
  activeAthletes = 0;
  professionalAthletes = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.athleteForm = this.formBuilder.group({
      user: ['', [Validators.required]],
      height: ['', [Validators.min(100), Validators.max(250)]],
      weight: ['', [Validators.min(30), Validators.max(200)]],
      position: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadAthletes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAthletes(): void {
    this.loading = true;
    this.competenciesService.getAthletes().subscribe({
      next: (athletes) => {
        this.athletes = athletes;
        this.dataSource.data = athletes;
        this.activeAthletes = athletes.length;
        this.professionalAthletes = Math.floor(athletes.length * 0.6); // Estimación
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading athletes:', error);
        this.showError('Error al cargar los atletas');
        this.loading = false;
        this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockAthletes: Athlete[] = [
      {
        id: 1,
        user: 1,
        height: 180,
        weight: 75,
        position: 'delantero',
        isActive: true
      },
      {
        id: 2,
        user: 2,
        height: 165,
        weight: 58,
        position: 'centrocampista',
        isActive: true
      },
      {
        id: 3,
        user: 3,
        height: 175,
        weight: 70,
        position: 'defensa',
        isActive: true
      }
    ];
    this.athletes = mockAthletes;
    this.dataSource.data = mockAthletes;
    this.activeAthletes = mockAthletes.length;
    this.professionalAthletes = 2;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingAthlete = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingAthlete = null;
    this.resetForm();
  }

  resetForm(): void {
    this.athleteForm.reset();
    this.editingAthlete = null;
  }

  onSubmit(): void {
    if (this.athleteForm.valid) {
      this.loading = true;
      const formData = this.athleteForm.value;

      if (this.editingAthlete) {
        this.updateAthlete(formData);
      } else {
        this.createAthlete(formData);
      }
    }
  }

  createAthlete(data: CreateAthleteDto): void {
    this.competenciesService.createAthlete(data).subscribe({
      next: (athlete) => {
        this.showSuccess('Atleta creado exitosamente');
        this.loadAthletes();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating athlete:', error);
        this.showError('Error al crear el atleta');
        this.loading = false;
      }
    });
  }

  updateAthlete(data: UpdateAthleteDto): void {
    if (this.editingAthlete?.id) {
      this.competenciesService.updateAthlete(this.editingAthlete.id, data).subscribe({
        next: (athlete) => {
          this.showSuccess('Atleta actualizado exitosamente');
          this.loadAthletes();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating athlete:', error);
          this.showError('Error al actualizar el atleta');
          this.loading = false;
        }
      });
    }
  }

  editAthlete(athlete: Athlete): void {
    this.editingAthlete = athlete;
    this.athleteForm.patchValue({
      user: athlete.user,
      height: athlete.height,
      weight: athlete.weight,
      position: athlete.position,
      isActive: athlete.isActive
    });
    this.showForm = true;
  }

  deleteAthlete(athlete: Athlete): void {
    if (confirm(`¿Está seguro que desea eliminar al atleta con ID ${athlete.id}?`)) {
      if (athlete.id) {
        this.competenciesService.deleteAthlete(athlete.id).subscribe({
          next: () => {
            this.showSuccess('Atleta eliminado exitosamente');
            this.loadAthletes();
          },
          error: (error) => {
            console.error('Error deleting athlete:', error);
            this.showError('Error al eliminar el atleta');
          }
        });
      }
    }
  }

  selectAthlete(athlete: Athlete): void {
    console.log('Selected athlete:', athlete);
  }

  viewProfile(athlete: Athlete): void {
    this.showInfo(`Perfil del atleta ID: ${athlete.id}`);
  }

  viewStatistics(athlete: Athlete): void {
    this.showInfo(`Estadísticas del atleta ID: ${athlete.id}`);
  }

  refreshData(): void {
    this.loadAthletes();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPositionClass(position: string): string {
    return position?.toLowerCase() || 'default';
  }

  getPositionIcon(position: string): string {
    const icons: { [key: string]: string } = {
      'delantero': 'sports_soccer',
      'centrocampista': 'sports',
      'defensa': 'security',
      'portero': 'sports_handball'
    };
    return icons[position?.toLowerCase()] || 'sports';
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
