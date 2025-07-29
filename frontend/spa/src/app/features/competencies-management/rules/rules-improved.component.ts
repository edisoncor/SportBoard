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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { Rule, CreateRuleDto, UpdateRuleDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de reglas de competencias
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-rules',
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
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="rules-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">rule</mat-icon>
            Gestión de Reglas
          </h1>
          <p class="page-subtitle">Administre las reglas del sistema de competencias</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nueva Regla
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
            <mat-icon class="stat-icon">rule</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ rules.length }}</span>
              <span class="stat-label">Total Reglas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeRules }}</span>
              <span class="stat-label">Activas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">priority_high</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ criticalRules }}</span>
              <span class="stat-label">Críticas</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingRule ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingRule ? 'Editar' : 'Crear' }} Regla
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="ruleForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información Básica
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Regla</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Tiempo de juego">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-error *ngIf="ruleForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                  <mat-error *ngIf="ruleForm.get('name')?.hasError('maxlength')">
                    Máximo 100 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nivel de Importancia</mat-label>
                  <mat-select formControlName="level">
                    <mat-option [value]="1">Nivel 1 - Básico</mat-option>
                    <mat-option [value]="2">Nivel 2 - Intermedio</mat-option>
                    <mat-option [value]="3">Nivel 3 - Avanzado</mat-option>
                    <mat-option [value]="4">Nivel 4 - Experto</mat-option>
                    <mat-option [value]="5">Nivel 5 - Crítico</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>speed</mat-icon>
                  <mat-error *ngIf="ruleForm.get('level')?.hasError('required')">
                    El nivel es obligatorio
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" 
                           placeholder="Descripción detallada de la regla..."
                           rows="4" maxlength="500"></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                  <mat-error *ngIf="ruleForm.get('description')?.hasError('required')">
                    La descripción es obligatoria
                  </mat-error>
                  <mat-hint>{{ ruleForm.get('description')?.value?.length || 0 }}/500 caracteres</mat-hint>
                </mat-form-field>
              </div>

              <div class="form-row">
                <div class="toggle-section">
                  <mat-slide-toggle formControlName="isActive" color="primary">
                    <span class="toggle-label">
                      <mat-icon>{{ ruleForm.get('isActive')?.value ? 'check_circle' : 'cancel' }}</mat-icon>
                      {{ ruleForm.get('isActive')?.value ? 'Regla Activa' : 'Regla Inactiva' }}
                    </span>
                  </mat-slide-toggle>
                </div>
              </div>
            </div>

            <div class="form-actions-row">
              <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                <mat-icon>refresh</mat-icon>
                Limpiar
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="ruleForm.invalid || loading" class="submit-btn">
                <mat-icon>{{ editingRule ? 'save' : 'add_circle' }}</mat-icon>
                {{ loading ? 'Guardando...' : (editingRule ? 'Actualizar' : 'Crear') }}
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
            <mat-icon>rule</mat-icon>
            Lista de Reglas
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar reglas</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, descripción...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando reglas...</p>
          </div>

          <div *ngIf="!loading && rules.length === 0" class="empty-state">
            <mat-icon class="empty-icon">rule</mat-icon>
            <h3>No hay reglas registradas</h3>
            <p>Comience agregando su primera regla</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Regla
            </button>
          </div>

          <div *ngIf="!loading && rules.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let rule">
                  <div class="rule-id">
                    <div class="rule-icon">
                      <mat-icon>rule</mat-icon>
                    </div>
                    <span class="id-number">{{ rule.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Regla</th>
                <td mat-cell *matCellDef="let rule">
                  <div class="rule-info">
                    <div class="rule-name">{{ rule.name }}</div>
                    <div class="rule-description">{{ rule.description | slice:0:80 }}{{ rule.description?.length > 80 ? '...' : '' }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nivel -->
              <ng-container matColumnDef="level">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nivel</th>
                <td mat-cell *matCellDef="let rule">
                  <mat-chip class="level-chip" [class]="getLevelClass(rule.level)">
                    <mat-icon>{{ getLevelIcon(rule.level) }}</mat-icon>
                    Nivel {{ rule.level }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let rule">
                  <mat-chip class="status-chip" [class]="rule.isActive ? 'active' : 'inactive'">
                    <mat-icon>{{ rule.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                    {{ rule.isActive ? 'Activa' : 'Inactiva' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let rule">
                  <div class="dates-info">
                    <div class="created-date">
                      <mat-icon class="date-icon">schedule</mat-icon>
                      {{ rule.createdAt | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="updated-date" *ngIf="rule.updatedAt">
                      <mat-icon class="date-icon">update</mat-icon>
                      {{ rule.updatedAt | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let rule">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editRule(rule)" 
                            matTooltip="Editar regla">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(rule)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateRule(rule)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="toggleStatus(rule)">
                        <mat-icon>{{ rule.isActive ? 'toggle_off' : 'toggle_on' }}</mat-icon>
                        {{ rule.isActive ? 'Desactivar' : 'Activar' }}
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteRule(rule)" class="delete-action">
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
                  (click)="selectRule(row)"></tr>
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
    .rules-container {
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
      background: linear-gradient(135deg, #673ab7 0%, #9c27b0 100%);
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

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .toggle-section {
      grid-column: 1 / -1;
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

    .rule-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .rule-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e8eaf6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #673ab7;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .rule-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .rule-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .rule-description {
      font-size: 0.8rem;
      color: #666;
      line-height: 1.4;
    }

    .level-chip {
      font-size: 0.8rem;
    }

    .level-chip.level-1 {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .level-chip.level-2 {
      background: #fff3e0;
      color: #f57c00;
    }

    .level-chip.level-3 {
      background: #e3f2fd;
      color: #1976d2;
    }

    .level-chip.level-4 {
      background: #fce4ec;
      color: #c2185b;
    }

    .level-chip.level-5 {
      background: #ffebee;
      color: #d32f2f;
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
      .rules-container {
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
export class RulesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  rules: Rule[] = [];
  dataSource = new MatTableDataSource<Rule>([]);
  ruleForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'level', 'status', 'dates', 'actions'];
  loading = false;
  showForm = false;
  editingRule: Rule | null = null;
  activeRules = 0;
  criticalRules = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.ruleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      level: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadRules();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRules(): void {
    this.loading = true;
    this.competenciesService.getRules().subscribe({
      next: (rules) => {
        this.rules = rules;
        this.dataSource.data = rules;
        this.activeRules = rules.filter(r => r.isActive).length;
        this.criticalRules = rules.filter(r => r.level >= 4).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rules:', error);
        this.showError('Error al cargar las reglas');
        this.loading = false;
        this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockRules: Rule[] = [
      {
        id: 1,
        name: 'Tiempo de juego',
        description: 'El partido debe durar 90 minutos divididos en dos tiempos de 45 minutos cada uno',
        level: 5,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'Número de jugadores',
        description: 'Cada equipo debe tener 11 jugadores en el campo',
        level: 5,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 3,
        name: 'Sustituciones',
        description: 'Se permiten máximo 5 sustituciones por equipo durante el partido',
        level: 3,
        isActive: true,
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 4,
        name: 'Tarjetas amarillas',
        description: 'Dos tarjetas amarillas equivalen a una expulsión',
        level: 4,
        isActive: false,
        createdAt: '2024-01-15T11:30:00Z'
      }
    ];
    this.rules = mockRules;
    this.dataSource.data = mockRules;
    this.activeRules = mockRules.filter(r => r.isActive).length;
    this.criticalRules = mockRules.filter(r => r.level >= 4).length;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingRule = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingRule = null;
    this.resetForm();
  }

  resetForm(): void {
    this.ruleForm.reset({
      isActive: true
    });
    this.editingRule = null;
  }

  onSubmit(): void {
    if (this.ruleForm.valid) {
      this.loading = true;
      const formData = this.ruleForm.value;

      if (this.editingRule) {
        this.updateRule(formData);
      } else {
        this.createRule(formData);
      }
    }
  }

  createRule(data: CreateRuleDto): void {
    this.competenciesService.createRule(data).subscribe({
      next: (rule) => {
        this.showSuccess('Regla creada exitosamente');
        this.loadRules();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating rule:', error);
        this.showError('Error al crear la regla');
        this.loading = false;
      }
    });
  }

  updateRule(data: UpdateRuleDto): void {
    if (this.editingRule?.id) {
      this.competenciesService.updateRule(this.editingRule.id, data).subscribe({
        next: (rule) => {
          this.showSuccess('Regla actualizada exitosamente');
          this.loadRules();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating rule:', error);
          this.showError('Error al actualizar la regla');
          this.loading = false;
        }
      });
    }
  }

  editRule(rule: Rule): void {
    this.editingRule = rule;
    this.ruleForm.patchValue({
      name: rule.name,
      description: rule.description,
      level: rule.level,
      isActive: rule.isActive
    });
    this.showForm = true;
  }

  deleteRule(rule: Rule): void {
    if (confirm(`¿Está seguro que desea eliminar la regla "${rule.name}"?`)) {
      if (rule.id) {
        this.competenciesService.deleteRule(rule.id).subscribe({
          next: () => {
            this.showSuccess('Regla eliminada exitosamente');
            this.loadRules();
          },
          error: (error) => {
            console.error('Error deleting rule:', error);
            this.showError('Error al eliminar la regla');
          }
        });
      }
    }
  }

  duplicateRule(rule: Rule): void {
    const duplicatedRule: CreateRuleDto = {
      name: `${rule.name} (Copia)`,
      description: rule.description,
      level: rule.level,
      isActive: false
    };
    
    this.competenciesService.createRule(duplicatedRule).subscribe({
      next: () => {
        this.showSuccess('Regla duplicada exitosamente');
        this.loadRules();
      },
      error: (error) => {
        console.error('Error duplicating rule:', error);
        this.showError('Error al duplicar la regla');
      }
    });
  }

  toggleStatus(rule: Rule): void {
    if (rule.id) {
      const updateData: UpdateRuleDto = {
        isActive: !rule.isActive
      };
      
      this.competenciesService.updateRule(rule.id, updateData).subscribe({
        next: () => {
          this.showSuccess(`Regla ${rule.isActive ? 'desactivada' : 'activada'} exitosamente`);
          this.loadRules();
        },
        error: (error) => {
          console.error('Error toggling rule status:', error);
          this.showError('Error al cambiar el estado de la regla');
        }
      });
    }
  }

  selectRule(rule: Rule): void {
    console.log('Selected rule:', rule);
  }

  viewDetails(rule: Rule): void {
    this.showInfo(`Regla: ${rule.name}`);
  }

  refreshData(): void {
    this.loadRules();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getLevelClass(level: number): string {
    return `level-${level}`;
  }

  getLevelIcon(level: number): string {
    const icons: { [key: number]: string } = {
      1: 'trending_up',
      2: 'star_border',
      3: 'star_half',
      4: 'star',
      5: 'priority_high'
    };
    return icons[level] || 'help';
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
