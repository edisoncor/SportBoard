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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompetenciesService } from '../../../core/services/competencies/competencies.service';
import { Season, CreateSeasonDto, UpdateSeasonDto } from '../../../core/models/competencies';

/**
 * Componente para la gestión de temporadas deportivas
 * Versión mejorada con diseño profesional y funcionalidades avanzadas
 */
@Component({
  selector: 'app-seasons',
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
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="seasons-container">
      <!-- Header con título y acciones principales -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">calendar_view_month</mat-icon>
            Temporadas Deportivas
          </h1>
          <p class="page-subtitle">Administre las temporadas de las competencias</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nueva Temporada
          </button>
          <button mat-icon-button matTooltip="Actualizar lista" (click)="refreshData()">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Botón flotante para guardar cuando el formulario está activo -->
      <div class="floating-save-button" *ngIf="showForm && !editingSeason">
        <button mat-fab color="primary" 
                (click)="onSubmit()" 
                [disabled]="seasonForm.invalid || loading"
                matTooltip="Guardar Nueva Temporada"
                class="fab-save">
          <mat-icon *ngIf="!loading">save</mat-icon>
          <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
        </button>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="stats-row">
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">calendar_view_month</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ seasons.length }}</span>
              <span class="stat-label">Total Temporadas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">play_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeSeasons }}</span>
              <span class="stat-label">En Curso</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">emoji_events</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ finishedSeasons }}</span>
              <span class="stat-label">Finalizadas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">sports</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ uniqueCompetitions }}</span>
              <span class="stat-label">Competencias</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario de creación/edición (expandible) -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingSeason ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingSeason ? 'Editar' : 'Crear' }} Temporada
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideCreateForm()" matTooltip="Cerrar">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        
        <mat-card-content *ngIf="showForm">
          <form [formGroup]="seasonForm" (ngSubmit)="onSubmit()" class="modern-form">
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información de la Temporada
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Temporada</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Temporada 2024-2025">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-error *ngIf="seasonForm.get('name')?.hasError('required')">
                    El nombre es obligatorio
                  </mat-error>
                  <mat-error *ngIf="seasonForm.get('name')?.hasError('maxlength')">
                    Máximo 200 caracteres
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Competencia</mat-label>
                  <mat-select formControlName="competition">
                    <mat-option value="">Seleccione una competencia</mat-option>
                    <mat-option value="1">Competencia 1</mat-option>
                    <mat-option value="2">Competencia 2</mat-option>
                    <mat-option value="3">Competencia 3</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>emoji_events</mat-icon>
                  <mat-error *ngIf="seasonForm.get('competition')?.hasError('required')">
                    La competencia es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" 
                           placeholder="Descripción detallada de la temporada..."
                           rows="3" maxlength="500"></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                  <mat-error *ngIf="seasonForm.get('description')?.hasError('required')">
                    La descripción es obligatoria
                  </mat-error>
                  <mat-hint>{{ seasonForm.get('description')?.value?.length || 0 }}/500 caracteres</mat-hint>
                </mat-form-field>
              </div>
            </div>

            <!-- Fechas -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>date_range</mat-icon>
                Fechas de la Temporada
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Inicio</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  <mat-error *ngIf="seasonForm.get('startDate')?.hasError('required')">
                    La fecha de inicio es obligatoria
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Fin</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endTime">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                  <mat-error *ngIf="seasonForm.get('endTime')?.hasError('required')">
                    La fecha de fin es obligatoria
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <!-- Campeones y Estado -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>emoji_events</mat-icon>
                Campeones y Estado
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Campeón</mat-label>
                  <input matInput formControlName="champion" placeholder="Nombre del equipo campeón">
                  <mat-icon matSuffix>military_tech</mat-icon>
                  <mat-hint>Opcional: Solo si la temporada terminó</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Subcampeón</mat-label>
                  <input matInput formControlName="subChampion" placeholder="Nombre del subcampeón">
                  <mat-icon matSuffix>looks_two</mat-icon>
                  <mat-hint>Opcional: Solo si la temporada terminó</mat-hint>
                </mat-form-field>
              </div>

              <div class="form-row">
                <div class="toggle-section">
                  <mat-slide-toggle formControlName="hasEnd" color="primary">
                    <span class="toggle-label">
                      <mat-icon>{{ seasonForm.get('hasEnd')?.value ? 'check_circle' : 'schedule' }}</mat-icon>
                      {{ seasonForm.get('hasEnd')?.value ? 'Temporada Finalizada' : 'Temporada en Curso' }}
                    </span>
                  </mat-slide-toggle>
                </div>

                <div class="toggle-section">
                  <mat-slide-toggle formControlName="hasChampion" color="primary">
                    <span class="toggle-label">
                      <mat-icon>{{ seasonForm.get('hasChampion')?.value ? 'emoji_events' : 'pending' }}</mat-icon>
                      {{ seasonForm.get('hasChampion')?.value ? 'Tiene Campeón Definido' : 'Sin Campeón Definido' }}
                    </span>
                  </mat-slide-toggle>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="form-actions-section">
              <div class="action-info">
                <mat-icon>info</mat-icon>
                <span>{{ editingSeason ? 'Modifique los campos necesarios y guarde los cambios' : 'Complete todos los campos requeridos para crear la temporada' }}</span>
              </div>
              <div class="form-actions-row">
                <button mat-button type="button" (click)="resetForm()" class="secondary-btn">
                  <mat-icon>refresh</mat-icon>
                  Limpiar
                </button>
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="seasonForm.invalid || loading" class="submit-btn">
                  <mat-icon>{{ editingSeason ? 'save' : 'add_circle' }}</mat-icon>
                  {{ loading ? 'Guardando...' : (editingSeason ? 'Actualizar Temporada' : 'Crear Temporada') }}
                  <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                </button>
              </div>
            </div>
          </form>

          <!-- Botón de acción principal - Más visible -->
          <div class="main-action-button" *ngIf="showForm">
            <button mat-raised-button color="primary" 
                    (click)="onSubmit()" 
                    [disabled]="seasonForm.invalid || loading" 
                    class="primary-submit-btn">
              <mat-icon>{{ editingSeason ? 'save' : 'add_circle' }}</mat-icon>
              {{ loading ? 'Guardando Temporada...' : (editingSeason ? 'Actualizar Temporada' : 'Crear Nueva Temporada') }}
              <mat-spinner *ngIf="loading" diameter="18" class="btn-spinner"></mat-spinner>
            </button>
            <div class="button-help-text" *ngIf="seasonForm.invalid && !loading">
              <mat-icon>error_outline</mat-icon>
              <span>Complete todos los campos obligatorios para continuar</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de datos mejorada -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>calendar_view_month</mat-icon>
            Lista de Temporadas
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar temporadas</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, competencia...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando temporadas...</p>
          </div>

          <div *ngIf="!loading && seasons.length === 0" class="empty-state">
            <mat-icon class="empty-icon">calendar_view_month</mat-icon>
            <h3>No hay temporadas registradas</h3>
            <p>Comience agregando su primera temporada deportiva</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Temporada
            </button>
          </div>

          <div *ngIf="!loading && seasons.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let season">
                  <div class="season-id">
                    <div class="season-icon">
                      <mat-icon>calendar_view_month</mat-icon>
                    </div>
                    <span class="id-number">{{ season.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Temporada -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Temporada</th>
                <td mat-cell *matCellDef="let season">
                  <div class="season-info">
                    <div class="season-name">{{ season.name }}</div>
                    <div class="season-description">{{ season.description | slice:0:40 }}{{ season.description?.length > 40 ? '...' : '' }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Competencia -->
              <ng-container matColumnDef="competition">
                <th mat-header-cell *matHeaderCellDef>Competencia</th>
                <td mat-cell *matCellDef="let season">
                  <div class="competition-info">
                    <mat-chip class="competition-chip">
                      <mat-icon>emoji_events</mat-icon>
                      {{ getCompetitionName(season.competition) }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Fechas -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Período</th>
                <td mat-cell *matCellDef="let season">
                  <div class="dates-info">
                    <div class="date-range">
                      <mat-icon class="date-icon">date_range</mat-icon>
                      {{ season.startDate | date:'dd/MM/yyyy' }} - {{ season.endTime | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="duration">
                      <mat-icon class="date-icon">schedule</mat-icon>
                      {{ calculateDuration(season.startDate, season.endTime) }} días
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let season">
                  <div class="status-info">
                    <mat-chip class="status-chip" [class]="getStatusClass(season)">
                      <mat-icon>{{ getStatusIcon(season) }}</mat-icon>
                      {{ getStatusDisplay(season) }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Campeones -->
              <ng-container matColumnDef="champions">
                <th mat-header-cell *matHeaderCellDef>Campeones</th>
                <td mat-cell *matCellDef="let season">
                  <div class="champions-info" *ngIf="season.hasChampion; else noChampion">
                    <div class="champion" *ngIf="season.champion">
                      <mat-icon class="champion-icon">military_tech</mat-icon>
                      {{ season.champion }}
                    </div>
                    <div class="subchampion" *ngIf="season.subChampion">
                      <mat-icon class="subchampion-icon">looks_two</mat-icon>
                      {{ season.subChampion }}
                    </div>
                  </div>
                  <ng-template #noChampion>
                    <span class="no-champion">Por definir</span>
                  </ng-template>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let season">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editSeason(season)" 
                            matTooltip="Editar temporada">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(season)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="managePhases(season)">
                        <mat-icon>view_module</mat-icon>
                        Gestionar fases
                      </button>
                      <button mat-menu-item (click)="duplicateSeason(season)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="exportSeason(season)">
                        <mat-icon>download</mat-icon>
                        Exportar datos
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteSeason(season)" class="delete-action">
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
                  (click)="selectSeason(row)"></tr>
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
    .seasons-container {
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
      background: linear-gradient(135deg, #673ab7 0%, #9575cd 100%);
      color: white;
    }

    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
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
      max-height: 900px;
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
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .form-actions-section {
      margin-top: 32px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
    }

    .action-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #666;
      font-size: 14px;
    }

    .action-info mat-icon {
      color: #2196f3;
      font-size: 18px;
    }

    .main-action-button {
      margin-top: 32px;
      padding: 24px;
      text-align: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      border: 2px dashed #2196f3;
    }

    .primary-submit-btn {
      min-width: 220px;
      height: 56px;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: linear-gradient(45deg, #2196f3, #21cbf3);
      border-radius: 28px;
      box-shadow: 0 8px 16px rgba(33, 150, 243, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .primary-submit-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 24px rgba(33, 150, 243, 0.4);
      background: linear-gradient(45deg, #1976d2, #00bcd4);
    }

    .primary-submit-btn:disabled {
      background: #ccc;
      color: #666;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-spinner {
      margin-left: 8px;
    }

    .button-help-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
      color: #f44336;
      font-size: 14px;
      font-weight: 500;
    }

    .button-help-text mat-icon {
      font-size: 18px;
    }

    .floating-save-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }

    .fab-save {
      width: 64px;
      height: 64px;
      box-shadow: 0 8px 16px rgba(33, 150, 243, 0.4);
      animation: pulse 2s infinite;
    }

    .fab-save:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: 0 12px 24px rgba(33, 150, 243, 0.6);
    }

    .fab-save:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      animation: none;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 8px 16px rgba(33, 150, 243, 0.4);
      }
      50% {
        box-shadow: 0 8px 16px rgba(33, 150, 243, 0.7);
      }
      100% {
        box-shadow: 0 8px 16px rgba(33, 150, 243, 0.4);
      }
    }    .submit-btn {
      min-width: 150px;
      height: 48px;
      position: relative;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(33, 150, 243, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

    .season-id {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .season-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ede7f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #673ab7;
    }

    .id-number {
      font-weight: bold;
      color: #666;
    }

    .season-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .season-name {
      font-weight: 500;
      font-size: 1rem;
    }

    .season-description {
      font-size: 0.8rem;
      color: #666;
      line-height: 1.4;
    }

    .competition-info {
      display: flex;
      align-items: center;
    }

    .competition-chip {
      background: #fff3e0;
      color: #f57c00;
      font-size: 0.8rem;
    }

    .dates-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date-range,
    .duration {
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

    .status-info {
      display: flex;
      align-items: center;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-chip.finished {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .status-chip.upcoming {
      background: #e3f2fd;
      color: #1976d2;
    }

    .champions-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .champion,
    .subchampion {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
    }

    .champion-icon {
      color: #ff9800;
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .subchampion-icon {
      color: #9e9e9e;
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .no-champion {
      color: #999;
      font-style: italic;
      font-size: 0.8rem;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #d32f2f;
    }

    @media (max-width: 768px) {
      .seasons-container {
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
export class SeasonsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  seasons: Season[] = [];
  dataSource = new MatTableDataSource<Season>([]);
  seasonForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'competition', 'dates', 'status', 'champions', 'actions'];
  loading = false;
  showForm = false;
  editingSeason: Season | null = null;
  activeSeasons = 0;
  finishedSeasons = 0;
  uniqueCompetitions = 0;

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.seasonForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      startDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      competition: ['', [Validators.required]],
      champion: [''],
      subChampion: [''],
      hasEnd: [false],
      hasChampion: [false]
    });
  }

  ngOnInit(): void {
    this.loadSeasons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSeasons(): void {
    this.loading = true;
    this.competenciesService.getSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
        this.dataSource.data = seasons;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading seasons:', error);
        this.showError('Error al cargar las temporadas');
        this.loading = false;
        // Comentamos showMockData para usar solo datos reales
        // this.showMockData();
      }
    });
  }

  showMockData(): void {
    const mockSeasons: Season[] = [
      {
        id: 1,
        name: 'Temporada 2024-2025',
        description: 'Temporada oficial de la Liga Colombiana de Fútbol 2024-2025',
        startDate: new Date('2024-02-01'),
        endTime: new Date('2024-12-15'),
        champion: 'Millonarios FC',
        subChampion: 'Atlético Nacional',
        hasEnd: true,
        hasChampion: true,
        competition: 2,
        createdAt: new Date('2024-01-15T10:00:00Z')
      },
      {
        id: 2,
        name: 'Copa América 2024',
        description: 'Edición 2024 de la Copa América de Fútbol',
        startDate: new Date('2024-06-01'),
        endTime: new Date('2024-07-15'),
        champion: 'Argentina',
        subChampion: 'Colombia',
        hasEnd: true,
        hasChampion: true,
        competition: 1,
        createdAt: new Date('2024-01-16T10:00:00Z')
      },
      {
        id: 3,
        name: 'Temporada 2025',
        description: 'Nueva temporada del Torneo Regional de Baloncesto',
        startDate: new Date('2025-01-15'),
        endTime: new Date('2025-06-30'),
        champion: '',
        subChampion: '',
        hasEnd: false,
        hasChampion: false,
        competition: 3,
        createdAt: new Date('2024-12-01T10:00:00Z')
      },
      {
        id: 4,
        name: 'Campeonato Sudamericano 2024',
        description: 'Campeonato de Tenis Sudamericano 2024',
        startDate: new Date('2024-04-01'),
        endTime: new Date('2024-04-15'),
        champion: 'Rafael Nadal',
        subChampion: 'Novak Djokovic',
        hasEnd: true,
        hasChampion: true,
        competition: 4,
        createdAt: new Date('2024-03-01T10:00:00Z')
      },
      {
        id: 5,
        name: 'Liga Local 2025',
        description: 'Liga Local de Volleyball temporada 2025',
        startDate: new Date('2025-03-01'),
        endTime: new Date('2025-08-30'),
        champion: '',
        subChampion: '',
        hasEnd: false,
        hasChampion: false,
        competition: 5,
        createdAt: new Date('2025-01-10T10:00:00Z')
      }
    ];
    this.seasons = mockSeasons;
    this.dataSource.data = mockSeasons;
    this.calculateStats();
  }

  calculateStats(): void {
    this.activeSeasons = this.seasons.filter(s => !s.hasEnd).length;
    this.finishedSeasons = this.seasons.filter(s => s.hasEnd).length;
    this.uniqueCompetitions = new Set(this.seasons.map(s => s.competition)).size;
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingSeason = null;
    this.resetForm();
  }

  hideCreateForm(): void {
    this.showForm = false;
    this.editingSeason = null;
    this.resetForm();
  }

  resetForm(): void {
    this.seasonForm.reset({
      hasEnd: false,
      hasChampion: false
    });
    this.editingSeason = null;
  }

  private extractIdFromUrl(url: string): number {
    const match = url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private transformFormData(formData: any): any {
    console.log('🏆 Raw season form data:', formData);
    
    const transformedData = { ...formData };
    
    // Transformar competition ID a URL completa
    if (transformedData.competition && typeof transformedData.competition === 'string') {
      const competitionId = parseInt(transformedData.competition);
      if (!isNaN(competitionId)) {
        transformedData.competition = `http://localhost/api/v1/competencies/competitions/${competitionId}/`;
      }
    }
    
    // Agregar campos requeridos si están vacíos
    if (!transformedData.champion || transformedData.champion === '') {
      transformedData.champion = 'TBD';
    }
    if (!transformedData.subChampion || transformedData.subChampion === '') {
      transformedData.subChampion = 'TBD';
    }
    
    // Asegurar que hasEnd y hasChampion tengan valores por defecto
    if (transformedData.hasEnd === null || transformedData.hasEnd === undefined) {
      transformedData.hasEnd = false;
    }
    if (transformedData.hasChampion === null || transformedData.hasChampion === undefined) {
      transformedData.hasChampion = false;
    }
    
    console.log('🔄 Transformed season data:', transformedData);
    return transformedData;
  }

  onSubmit(): void {
    if (this.seasonForm.valid) {
      this.loading = true;
      const rawFormData = this.seasonForm.value;
      const transformedData = this.transformFormData(rawFormData);

      console.log('🚀 Sending season data:', JSON.stringify(transformedData, null, 2));

      if (this.editingSeason) {
        this.updateSeason(transformedData);
      } else {
        this.createSeason(transformedData);
      }
    }
  }

  createSeason(data: CreateSeasonDto): void {
    this.competenciesService.createSeason(data).subscribe({
      next: (season) => {
        this.showSuccess('Temporada creada exitosamente');
        this.loadSeasons();
        this.hideCreateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating season:', error);
        this.showError('Error al crear la temporada');
        this.loading = false;
      }
    });
  }

  updateSeason(data: UpdateSeasonDto): void {
    if (this.editingSeason?.id) {
      this.competenciesService.updateSeason(this.editingSeason.id, data).subscribe({
        next: (season) => {
          this.showSuccess('Temporada actualizada exitosamente');
          this.loadSeasons();
          this.hideCreateForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating season:', error);
          this.showError('Error al actualizar la temporada');
          this.loading = false;
        }
      });
    }
  }

  editSeason(season: Season): void {
    this.editingSeason = season;
    
    // Extraer ID de competition
    let competitionValue: string;
    const comp = season.competition as any;
    
    if (comp && typeof comp === 'string') {
      if (comp.indexOf('http') !== -1) {
        // Es una URL, extraer el ID
        competitionValue = this.extractIdFromUrl(comp).toString();
      } else {
        // Ya es un ID como string
        competitionValue = comp;
      }
    } else if (typeof comp === 'number') {
      // Es un número, convertir a string
      competitionValue = comp.toString();
    } else if (comp && comp.id) {
      // Es un objeto Competition, usar su ID
      competitionValue = comp.id.toString();
    } else {
      // Valor por defecto
      competitionValue = '1';
    }
    
    this.seasonForm.patchValue({
      name: season.name,
      description: season.description,
      startDate: season.startDate,
      endTime: season.endTime,
      competition: competitionValue,
      champion: season.champion,
      subChampion: season.subChampion,
      hasEnd: season.hasEnd,
      hasChampion: season.hasChampion
    });
    this.showForm = true;
  }

  deleteSeason(season: Season): void {
    if (confirm(`¿Está seguro que desea eliminar la temporada "${season.name}"?`)) {
      if (season.id) {
        this.competenciesService.deleteSeason(season.id).subscribe({
          next: () => {
            this.showSuccess('Temporada eliminada exitosamente');
            this.loadSeasons();
          },
          error: (error) => {
            console.error('Error deleting season:', error);
            this.showError('Error al eliminar la temporada');
          }
        });
      }
    }
  }

  duplicateSeason(season: Season): void {
    const duplicatedSeason: CreateSeasonDto = {
      name: `${season.name} (Copia)`,
      description: season.description,
      startDate: season.startDate,
      endTime: season.endTime,
      competition: typeof season.competition === 'number' 
        ? season.competition 
        : season.competition.id || 1,
      champion: '',
      subChampion: '',
      hasEnd: false,
      hasChampion: false
    };
    
    this.competenciesService.createSeason(duplicatedSeason).subscribe({
      next: () => {
        this.showSuccess('Temporada duplicada exitosamente');
        this.loadSeasons();
      },
      error: (error) => {
        console.error('Error duplicating season:', error);
        this.showError('Error al duplicar la temporada');
      }
    });
  }

  selectSeason(season: Season): void {
    console.log('Selected season:', season);
  }

  viewDetails(season: Season): void {
    this.showInfo(`Temporada: ${season.name}`);
  }

  managePhases(season: Season): void {
    this.showInfo(`Gestionar fases para: ${season.name}`);
  }

  exportSeason(season: Season): void {
    this.showInfo(`Exportando datos de: ${season.name}`);
  }

  refreshData(): void {
    this.loadSeasons();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCompetitionName(competitionId: number | any): string {
    if (typeof competitionId === 'object') {
      return competitionId.name || 'Competencia personalizada';
    }

    const competitions: { [key: number]: string } = {
      1: 'Copa América 2024',
      2: 'Liga Colombiana de Fútbol',
      3: 'Torneo Regional de Baloncesto',
      4: 'Campeonato Sudamericano de Tenis',
      5: 'Liga Local de Volleyball',
      6: 'Copa Libertadores',
      7: 'Liga Europea de Baloncesto',
      8: 'Mundial de Atletismo'
    };
    return competitions[competitionId] || 'Competencia desconocida';
  }

  calculateDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusClass(season: Season): string {
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endTime);

    if (season.hasEnd) return 'finished';
    if (now >= start && now <= end) return 'active';
    return 'upcoming';
  }

  getStatusIcon(season: Season): string {
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endTime);

    if (season.hasEnd) return 'check_circle';
    if (now >= start && now <= end) return 'play_circle';
    return 'schedule';
  }

  getStatusDisplay(season: Season): string {
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endTime);

    if (season.hasEnd) return 'Finalizada';
    if (now >= start && now <= end) return 'En Curso';
    return 'Próxima';
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
