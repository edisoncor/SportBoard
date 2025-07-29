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
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { Administration, CreateAdministrationDto, UpdateAdministrationDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de administraciones deportivas
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-administrations',
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
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="administrations-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">business</mat-icon>
            Administraciones Deportivas
          </h1>
          <p class="page-subtitle">Gestione las organizaciones administrativas del sistema</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_business</mat-icon>
            Nueva Administración
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
            <mat-icon class="stat-icon">business</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ administrations.length }}</span>
              <span class="stat-label">Total Organizaciones</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeAdministrations }}</span>
              <span class="stat-label">Activas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">location_on</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ uniqueCountries }}</span>
              <span class="stat-label">Países</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">location_city</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ uniqueProvinces }}</span>
              <span class="stat-label">Provincias</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingAdministration ? 'edit' : 'add_business' }}</mat-icon>
            {{ editingAdministration ? 'Editar' : 'Crear' }} Administración
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="administrationForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información General
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Administración</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Federación Nacional de Fútbol">
                  <mat-icon matSuffix>business</mat-icon>
                  <mat-error *ngIf="administrationForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                  <mat-error *ngIf="administrationForm.get('name')?.hasError('maxlength')">
                    Máximo 200 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Teléfono</mat-label>
                  <input matInput formControlName="phone" placeholder="Ej: +57 300 123 4567">
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-error *ngIf="administrationForm.get('phone')?.hasError('required')">
                    El teléfono es obligatorio
                  </mat-error>
                  <mat-error *ngIf="administrationForm.get('phone')?.hasError('pattern')">
                    Formato de teléfono inválido
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <div class="toggle-section">
                  <mat-slide-toggle formControlName="isActive" color="primary">
                    <span class="toggle-label">
                      <mat-icon>{{ administrationForm.get('isActive')?.value ? 'check_circle' : 'cancel' }}</mat-icon>
                      {{ administrationForm.get('isActive')?.value ? 'Administración Activa' : 'Administración Inactiva' }}
                    </span>
                  </mat-slide-toggle>
                </div>
              </div>
            </div>

            <!-- Información de ubicación -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>location_on</mat-icon>
                Ubicación Geográfica
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>País</mat-label>
                  <mat-select formControlName="country">
                    <mat-option value="2">Estados Unidos</mat-option>
                    <mat-option value="3">New York (como país)</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flag</mat-icon>
                  <mat-error *ngIf="administrationForm.get('country')?.hasError('required')">
                    El país es obligatorio
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Provincia/Estado</mat-label>
                  <mat-select formControlName="province">
                    <mat-option value="2">Estados Unidos (Provincia)</mat-option>
                    <mat-option value="3">New York City (Provincia)</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>terrain</mat-icon>
                  <mat-error *ngIf="administrationForm.get('province')?.hasError('required')">
                    La provincia es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Ciudad</mat-label>
                  <mat-select formControlName="city">
                    <mat-option value="3">New York City</mat-option>
                    <mat-option value="2">Estados Unidos (Ciudad)</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>location_city</mat-icon>
                  <mat-error *ngIf="administrationForm.get('city')?.hasError('required')">
                    La ciudad es obligatoria
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Dirección Específica</mat-label>
                  <mat-select formControlName="location">
                    <mat-option value="3">New York City</mat-option>
                    <mat-option value="2">Estados Unidos (Ubicación)</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>place</mat-icon>
                  <mat-error *ngIf="administrationForm.get('location')?.hasError('required')">
                    La dirección es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="administrationForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingAdministration ? 'save' : 'add_business' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingAdministration ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>business</mat-icon>
            Lista de Administraciones
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar administraciones</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, ciudad, país...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando administraciones...</p>
          </div>

          <div *ngIf="!loading && administrations.length === 0" class="empty-state">
            <mat-icon class="empty-icon">business</mat-icon>
            <h3>No hay administraciones registradas</h3>
            <p>Comience agregando su primera organización administrativa</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_business</mat-icon>
              Agregar Administración
            </button>
          </div>

          <div *ngIf="!loading && administrations.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let admin">
                  <div class="admin-id">
                    <div class="admin-icon">
                      <mat-icon>business</mat-icon>
                    </div>
                    <span class="id-number">{{ admin.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Información -->
              <ng-container matColumnDef="info">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Administración</th>
                <td mat-cell *matCellDef="let admin">
                  <div class="admin-info">
                    <div class="admin-name">{{ admin.name }}</div>
                    <div class="admin-phone">
                      <mat-icon class="info-icon">phone</mat-icon>
                      {{ admin.phone }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Ubicación -->
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let admin">
                  <div class="location-info">
                    <div class="country-city">
                      <mat-icon class="location-icon">location_on</mat-icon>
                      {{ admin.city }}, {{ admin.country }}
                    </div>
                    <div class="province">{{ admin.province }}</div>
                    <div class="address">{{ admin.location }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let admin">
                  <mat-chip class="status-chip" [class]="admin.isActive ? 'active' : 'inactive'">
                    <mat-icon>{{ admin.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                    {{ admin.isActive ? 'Activa' : 'Inactiva' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let admin">
                  <div class="dates-info">
                    <div class="created-date">
                      <mat-icon class="date-icon">schedule</mat-icon>
                      {{ admin.createdAt | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="updated-date" *ngIf="admin.updatedAt">
                      <mat-icon class="date-icon">update</mat-icon>
                      {{ admin.updatedAt | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let admin">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editAdministration(admin)" 
                            matTooltip="Editar administración">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(admin)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateAdministration(admin)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="toggleStatus(admin)">
                        <mat-icon>{{ admin.isActive ? 'toggle_off' : 'toggle_on' }}</mat-icon>
                        {{ admin.isActive ? 'Desactivar' : 'Activar' }}
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteAdministration(admin)" class="delete-action">
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
                  (click)="selectAdministration(row)"></tr>
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
    .administrations-container {
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
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
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
      color: #2196f3;
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
      grid-column: 1 / -1;
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

    .admin-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .admin-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2196f3;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .admin-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .admin-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .admin-phone {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #666;
    }

    .info-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .location-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .country-city {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;
    }

    .location-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #2196f3;
    }

    .province,
    .address {
      font-size: 0.8rem;
      color: #666;
      margin-left: 18px;
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
      .administrations-container {
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
export class AdministrationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  administrations: Administration[] = [];
  dataSource = new MatTableDataSource<Administration>([]);
  administrationForm: FormGroup;
  displayedColumns: string[] = ['id', 'info', 'location', 'status', 'dates', 'actions'];
  loading = false;
  showForm = false;
  editingAdministration: Administration | null = null;
  activeAdministrations = 0;
  uniqueCountries = 0;
  uniqueProvinces = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.administrationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]+$/)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required, Validators.maxLength(100)]],
      country: ['', [Validators.required]],
      location: ['', [Validators.required, Validators.maxLength(300)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadAdministrations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAdministrations(): void {
    this.loading = true;
    this.competenciesService.getAdministrations().subscribe({
      next: (admins) => {
        this.administrations = admins;
        this.dataSource.data = admins;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading administrations:', error);
        this.showError('Error al cargar las administraciones');
        this.loading = false;
        // Comentamos showMockData para usar solo datos reales
        // this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockAdministrations: Administration[] = [
      {
        id: 1,
        name: 'Federación Colombiana de Fútbol',
        phone: '+57 1 288-9838',
        city: 'Bogotá',
        province: 'Cundinamarca',
        country: 'Colombia',
        location: 'Avenida 32 # 16-22',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'Liga de Baloncesto de Medellín',
        phone: '+57 4 444-5555',
        city: 'Medellín',
        province: 'Antioquia',
        country: 'Colombia',
        location: 'Carrera 70 # 45-30',
        isActive: true,
        createdAt: '2024-01-16T10:00:00Z'
      },
      {
        id: 3,
        name: 'Asociación de Tenis de Buenos Aires',
        phone: '+54 11 4444-5678',
        city: 'Buenos Aires',
        province: 'Buenos Aires',
        country: 'Argentina',
        location: 'Av. Corrientes 1234',
        isActive: true,
        createdAt: '2024-01-17T10:00:00Z'
      },
      {
        id: 4,
        name: 'Club de Natación São Paulo',
        phone: '+55 11 9999-8888',
        city: 'São Paulo',
        province: 'São Paulo',
        country: 'Brasil',
        location: 'Rua Augusta 500',
        isActive: false,
        createdAt: '2024-01-18T10:00:00Z'
      },
      {
        id: 5,
        name: 'Federación Peruana de Volleyball',
        phone: '+51 1 222-3333',
        city: 'Lima',
        province: 'Lima',
        country: 'Perú',
        location: 'Av. Javier Prado Este 123',
        isActive: true,
        createdAt: '2024-01-19T10:00:00Z'
      }
    ];
    this.administrations = mockAdministrations;
    this.dataSource.data = mockAdministrations;
    this.calculateStats();
  }

  calculateStats(): void {
    this.activeAdministrations = this.administrations.filter(a => a.isActive).length;
    this.uniqueCountries = new Set(this.administrations.map(a => a.country)).size;
    this.uniqueProvinces = new Set(this.administrations.map(a => a.province)).size;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingAdministration = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingAdministration = null;
    this.resetForm();
  }

  resetForm(): void {
    this.administrationForm.reset({
      isActive: true
    });
    this.editingAdministration = null;
  }

  onSubmit(): void {
    if (this.administrationForm.valid) {
      this.loading = true;
      const rawFormData = this.administrationForm.value;
      console.log('📋 Raw form data:', rawFormData);
      
      const formData = this.transformFormData(rawFormData);
      console.log('🔄 Transformed form data:', formData);

      if (this.editingAdministration) {
        this.updateAdministration(formData);
      } else {
        this.createAdministration(formData);
      }
    }
  }

  /**
   * Transforma los datos del formulario para convertir IDs en URLs completas de catálogos
   */
  private transformFormData(formData: any): any {
    const transformed = { ...formData };
    
    // Campos de catálogo que necesitan ser convertidos a URLs
    const catalogueFields = ['city', 'province', 'country', 'location'];
    
    catalogueFields.forEach(field => {
      if (transformed[field]) {
        // Convertir ID a URL completa
        const id = transformed[field];
        transformed[field] = `http://localhost:8010/api/v1/competencies/catalogues/${id}/`;
      }
    });

    return transformed;
  }

  createAdministration(data: CreateAdministrationDto): void {
    console.log('🚀 Sending administration data:', JSON.stringify(data, null, 2));
    this.competenciesService.createAdministration(data).subscribe({
      next: (admin) => {
        this.showSuccess('Administración creada exitosamente');
        this.loadAdministrations();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error creating administration:', error);
        this.showError('Error al crear la administración');
        this.loading = false;
      }
    });
  }

  updateAdministration(data: UpdateAdministrationDto): void {
    if (this.editingAdministration?.id) {
      this.competenciesService.updateAdministration(this.editingAdministration.id, data).subscribe({
        next: (admin) => {
          this.showSuccess('Administración actualizada exitosamente');
          this.loadAdministrations();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating administration:', error);
          this.showError('Error al actualizar la administración');
          this.loading = false;
        }
      });
    }
  }

  editAdministration(admin: Administration): void {
    this.editingAdministration = admin;
    this.administrationForm.patchValue({
      name: admin.name,
      phone: admin.phone,
      city: this.extractIdFromUrl(admin.city),
      province: this.extractIdFromUrl(admin.province),
      country: this.extractIdFromUrl(admin.country),
      location: this.extractIdFromUrl(admin.location),
      isActive: admin.isActive
    });
    this.showForm = true;
  }

  /**
   * Extrae el ID de una URL completa
   */
  private extractIdFromUrl(url: string | undefined): string {
    if (!url) return '';
    
    // Extraer ID de URLs como "http://localhost:8010/api/v1/competencies/catalogues/1/"
    const match = url.match(/\/(\d+)\/?$/);
    return match ? match[1] : url;
  }

  deleteAdministration(admin: Administration): void {
    if (confirm(`¿Está seguro que desea eliminar la administración "${admin.name}"?`)) {
      if (admin.id) {
        this.competenciesService.deleteAdministration(admin.id).subscribe({
          next: () => {
            this.showSuccess('Administración eliminada exitosamente');
            this.loadAdministrations();
          },
          error: (error) => {
            console.error('Error deleting administration:', error);
            this.showError('Error al eliminar la administración');
          }
        });
      }
    }
  }

  duplicateAdministration(admin: Administration): void {
    const duplicatedAdmin: CreateAdministrationDto = {
      name: `${admin.name} (Copia)`,
      phone: admin.phone,
      city: admin.city,
      province: admin.province,
      country: admin.country,
      location: admin.location,
      isActive: false
    };
    
    // Transformar los datos para incluir URLs completas
    const transformedData = this.transformFormData(duplicatedAdmin);
    
    this.competenciesService.createAdministration(transformedData).subscribe({
      next: () => {
        this.showSuccess('Administración duplicada exitosamente');
        this.loadAdministrations();
      },
      error: (error) => {
        console.error('Error duplicating administration:', error);
        this.showError('Error al duplicar la administración');
      }
    });
  }

  toggleStatus(admin: Administration): void {
    if (admin.id) {
      const updateData: UpdateAdministrationDto = {
        isActive: !admin.isActive
      };
      
      this.competenciesService.updateAdministration(admin.id, updateData).subscribe({
        next: () => {
          this.showSuccess(`Administración ${admin.isActive ? 'desactivada' : 'activada'} exitosamente`);
          this.loadAdministrations();
        },
        error: (error) => {
          console.error('Error toggling administration status:', error);
          this.showError('Error al cambiar el estado');
        }
      });
    }
  }

  selectAdministration(admin: Administration): void {
    console.log('Selected administration:', admin);
  }

  viewDetails(admin: Administration): void {
    this.showInfo(`Administración: ${admin.name} - ${admin.city}, ${admin.country}`);
  }

  refreshData(): void {
    this.loadAdministrations();
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
