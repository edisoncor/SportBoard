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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Game } from '../../../core/models/competencies/Game';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

// Interfaz extendida para el componente con propiedades adicionales para la UI
interface GameDisplay extends Game {
  status?: 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed';
  venue?: string;
  referee?: string;
  duration?: number;
  attendance?: number;
}

@Component({
  selector: 'app-games',
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
    MatDividerModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="games-container">
      <!-- Encabezado principal -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">sports_soccer</mat-icon>
            Gestión de Juegos
          </h1>
          <p class="page-subtitle">Administre los encuentros y partidos del sistema deportivo</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nuevo Juego
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
            <mat-icon class="stat-icon">sports_soccer</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ totalGames }}</span>
              <span class="stat-label">Total Juegos</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">live_tv</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ liveGames }}</span>
              <span class="stat-label">En Vivo</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">schedule</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ scheduledGames }}</span>
              <span class="stat-label">Programados</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ finishedGames }}</span>
              <span class="stat-label">Finalizados</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario expandible -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingGame ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingGame ? 'Editar Juego' : 'Nuevo Juego' }}
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideForm()" matTooltip="Cerrar formulario">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>

        <mat-card-content *ngIf="showForm" class="modern-form">
          <form [formGroup]="gameForm" (ngSubmit)="saveGame()">
            
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información del Encuentro
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre del Juego</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Final Copa Nacional">
                  <mat-icon matSuffix>sports_soccer</mat-icon>
                  <mat-error *ngIf="gameForm.get('name')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha y Hora</mat-label>
                  <input matInput type="datetime-local" formControlName="dateTime">
                  <mat-icon matSuffix>schedule</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Sede/Estadio</mat-label>
                  <input matInput formControlName="venue" placeholder="Nombre del estadio">
                  <mat-icon matSuffix>stadium</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Árbitro Principal</mat-label>
                  <input matInput formControlName="referee" placeholder="Nombre del árbitro">
                  <mat-icon matSuffix>person</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Equipos participantes -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>groups</mat-icon>
                Equipos Participantes
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Equipo Local</mat-label>
                  <mat-select formControlName="localTeam">
                    <mat-option value="1">Real Madrid CF</mat-option>
                    <mat-option value="2">FC Barcelona</mat-option>
                    <mat-option value="3">Atlético Madrid</mat-option>
                    <mat-option value="4">Valencia CF</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>home</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Equipo Visitante</mat-label>
                  <mat-select formControlName="visitorTeam">
                    <mat-option value="1">Real Madrid CF</mat-option>
                    <mat-option value="2">FC Barcelona</mat-option>
                    <mat-option value="3">Atlético Madrid</mat-option>
                    <mat-option value="4">Valencia CF</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flight_takeoff</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Goles Local</mat-label>
                  <input matInput type="number" formControlName="localScore" min="0" placeholder="0">
                  <mat-icon matSuffix>sports_score</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Goles Visitante</mat-label>
                  <input matInput type="number" formControlName="visitorScore" min="0" placeholder="0">
                  <mat-icon matSuffix>sports_score</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Estado y configuración -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>settings</mat-icon>
                Estado y Configuración
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fase de Competencia</mat-label>
                  <mat-select formControlName="phase">
                    <mat-option value="1">Fase de Grupos</mat-option>
                    <mat-option value="2">Octavos de Final</mat-option>
                    <mat-option value="3">Cuartos de Final</mat-option>
                    <mat-option value="4">Semifinales</mat-option>
                    <mat-option value="5">Final</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>timeline</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Estado del Juego</mat-label>
                  <mat-select formControlName="gameState">
                    <mat-option value="1">Programado</mat-option>
                    <mat-option value="2">En Vivo</mat-option>
                    <mat-option value="3">Finalizado</mat-option>
                    <mat-option value="4">Cancelado</mat-option>
                    <mat-option value="5">Pospuesto</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flag</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Estado</mat-label>
                  <mat-select formControlName="status">
                    <mat-option value="scheduled">Programado</mat-option>
                    <mat-option value="live">En Vivo</mat-option>
                    <mat-option value="finished">Finalizado</mat-option>
                    <mat-option value="cancelled">Cancelado</mat-option>
                    <mat-option value="postponed">Pospuesto</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>info</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Asistencia</mat-label>
                  <input matInput type="number" formControlName="attendance" min="0" placeholder="0">
                  <mat-icon matSuffix>people</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <div class="toggle-field">
                  <mat-slide-toggle formControlName="isActive" color="primary">
                    <span class="toggle-label">
                      <mat-icon>visibility</mat-icon>
                      Juego Activo
                    </span>
                  </mat-slide-toggle>
                  <p class="toggle-description">Los juegos activos son visibles en el sistema</p>
                </div>
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
                      [disabled]="saving || !gameForm.get('name')?.value" class="submit-btn">
                <mat-icon>{{ editingGame ? 'save' : 'add' }}</mat-icon>
                {{ editingGame ? 'Guardar Cambios' : 'Crear Juego' }}
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
            Lista de Juegos
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar juegos</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, equipos...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando juegos...</p>
          </div>

          <div *ngIf="!loading && games.length === 0" class="empty-state">
            <mat-icon class="empty-icon">sports_soccer</mat-icon>
            <h3>No hay juegos registrados</h3>
            <p>Comience agregando su primer encuentro deportivo</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Juego
            </button>
          </div>

          <div *ngIf="!loading && games.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let game">
                  <div class="game-id">
                    <div class="game-icon">
                      <mat-icon>sports_soccer</mat-icon>
                    </div>
                    <span class="id-number">{{ game.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Encuentro -->
              <ng-container matColumnDef="match">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Encuentro</th>
                <td mat-cell *matCellDef="let game">
                  <div class="match-info">
                    <div class="game-name">{{ game.name }}</div>
                    <div class="teams-display">
                      <span class="team local">{{ getTeamName(game.localTeam) }}</span>
                      <span class="vs">vs</span>
                      <span class="team visitor">{{ getTeamName(game.visitorTeam) }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Resultado -->
              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Resultado</th>
                <td mat-cell *matCellDef="let game">
                  <div class="score-display">
                    <div class="score-box" *ngIf="game.localScore !== undefined && game.visitorScore !== undefined">
                      <span class="local-score">{{ game.localScore }}</span>
                      <span class="separator">-</span>
                      <span class="visitor-score">{{ game.visitorScore }}</span>
                    </div>
                    <div class="no-score" *ngIf="game.localScore === undefined || game.visitorScore === undefined">
                      <span>Sin resultado</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Fecha -->
              <ng-container matColumnDef="datetime">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha y Hora</th>
                <td mat-cell *matCellDef="let game">
                  <div class="datetime-info">
                    <div class="date">{{ formatDate(game.dateTime) }}</div>
                    <div class="time">{{ formatTime(game.dateTime) }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                <td mat-cell *matCellDef="let game">
                  <mat-chip class="status-chip" [class]="getStatusClass(game.status)">
                    <mat-icon>{{ getStatusIcon(game.status) }}</mat-icon>
                    {{ getStatusDisplay(game.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let game">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editGame(game)" 
                            matTooltip="Editar juego">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(game)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateGame(game)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="updateScore(game)">
                        <mat-icon>sports_score</mat-icon>
                        Actualizar resultado
                      </button>
                      <button mat-menu-item (click)="changeStatus(game)">
                        <mat-icon>flag</mat-icon>
                        Cambiar estado
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteGame(game)" class="delete-action">
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
                  (click)="selectGame(row)"></tr>
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
    .games-container {
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
      color: #4caf50;
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
      background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
    }

    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    }

    .stat-card:nth-child(4) {
      background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
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
      overflow: visible;
    }

    .form-card:not(.expanded) {
      max-height: 80px;
      overflow: hidden;
    }

    .form-card.expanded {
      max-height: none;
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

    .toggle-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      grid-column: 1 / -1;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .toggle-description {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }

    .form-actions-row {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      position: relative;
      z-index: 1;
      background: white;
      padding: 16px 0;
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

    .game-id {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .game-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .game-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .id-number {
      font-weight: bold;
      color: #4caf50;
    }

    .match-info {
      display: flex;
      flex-direction: column;
    }

    .game-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .teams-display {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .team {
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }

    .team.local {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .team.visitor {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .vs {
      color: #666;
      font-weight: bold;
    }

    .score-display {
      display: flex;
      justify-content: center;
    }

    .score-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .local-score {
      color: #1976d2;
    }

    .visitor-score {
      color: #f57c00;
    }

    .separator {
      color: #666;
    }

    .no-score {
      color: #999;
      font-style: italic;
    }

    .datetime-info {
      display: flex;
      flex-direction: column;
    }

    .date {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .time {
      font-size: 0.8rem;
      color: #666;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.scheduled {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-chip.live {
      background-color: #ffebee;
      color: #d32f2f;
      animation: pulse 2s infinite;
    }

    .status-chip.finished {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-chip.cancelled {
      background-color: #fafafa;
      color: #757575;
    }

    .status-chip.postponed {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .games-container {
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

      .teams-display {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class GamesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  games: GameDisplay[] = [];
  dataSource = new MatTableDataSource<GameDisplay>([]);
  gameForm: FormGroup;
  displayedColumns: string[] = ['id', 'match', 'score', 'datetime', 'status', 'actions'];
  loading = false;
  saving = false;
  showForm = false;
  editingGame: GameDisplay | null = null;
  totalGames = 0;
  liveGames = 0;
  scheduledGames = 0;
  finishedGames = 0;

    mockGames: GameDisplay[] = [
    {
      id: 1,
      name: 'Clásico Nacional',
      startTime: '2024-03-15T15:00:00Z',
      endTime: '2024-03-15T17:00:00Z',
      localTeam: 'http://localhost/api/v1/competencies/teams/1/',
      visitorTeam: 'http://localhost/api/v1/competencies/teams/2/',
      phase: 'http://localhost/api/v1/competencies/phases/1/',
      gameState: 'http://localhost/api/v1/competencies/gamestates/1/',
      localScore: 2,
      visitorScore: 1,
      isActive: true,
      status: 'finished',
      venue: 'Estadio Nacional',
      referee: 'Carlos Vera',
      attendance: 45000
    },
    {
      id: 2,
      name: 'Derby Local',
      startTime: '2024-03-20T19:00:00Z',
      endTime: '2024-03-20T21:00:00Z',
      localTeam: 'http://localhost/api/v1/competencies/teams/3/',
      visitorTeam: 'http://localhost/api/v1/competencies/teams/1/',
      phase: 'http://localhost/api/v1/competencies/phases/2/',
      gameState: 'http://localhost/api/v1/competencies/gamestates/2/',
      localScore: 0,
      visitorScore: 0,
      isActive: true,
      status: 'live',
      venue: 'Estadio Municipal',
      referee: 'Luis García',
      attendance: 25000
    },
    {
      id: 3,
      name: 'Semifinal Copa',
      startTime: '2024-03-25T16:30:00Z',
      endTime: '2024-03-25T18:30:00Z',
      localTeam: 'http://localhost/api/v1/competencies/teams/2/',
      visitorTeam: 'http://localhost/api/v1/competencies/teams/3/',
      phase: 'http://localhost/api/v1/competencies/phases/3/',
      gameState: 'http://localhost/api/v1/competencies/gamestates/3/',
      isActive: true,
      status: 'scheduled',
      venue: 'Camp Nou',
      referee: 'Ricardo de Burgos',
      attendance: 0
    },
    {
      id: 4,
      name: 'Final Juvenil',
      startTime: '2024-04-01T12:00:00Z',
      endTime: '2024-04-01T14:00:00Z',
      localTeam: 'http://localhost/api/v1/competencies/teams/2/',
      visitorTeam: 'http://localhost/api/v1/competencies/teams/3/',
      phase: 'http://localhost/api/v1/competencies/phases/1/',
      gameState: 'http://localhost/api/v1/competencies/gamestates/3/',
      isActive: true,
      status: 'postponed',
      venue: 'Ciudad Deportiva',
      referee: 'Alejandro Hernández',
      attendance: 0
    }
  ];

  mockTeams = [
    { id: 1, name: 'Real Madrid CF' },
    { id: 2, name: 'FC Barcelona' },
    { id: 3, name: 'Atlético Madrid' },
    { id: 4, name: 'Valencia CF' }
  ];

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.gameForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      dateTime: ['', [Validators.required]],
      localTeam: ['', [Validators.required]],
      visitorTeam: ['', [Validators.required]],
      phase: ['', [Validators.required]],
      gameState: ['', [Validators.required]],
      localScore: [null],
      visitorScore: [null],
      isActive: [true],
      venue: [''],
      referee: [''],
      status: ['scheduled', [Validators.required]],
      attendance: [0]
    });
  }

  ngOnInit(): void {
    this.loadGames();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGames(): void {
    this.loading = true;
    this.competenciesService.getGames().subscribe({
      next: (games) => {
        console.log('📊 Games loaded successfully:', games);
        this.games = games;
        this.dataSource.data = this.games;
        this.totalGames = this.games.length;
        this.liveGames = this.games.filter(g => g.status === 'live').length;
        this.scheduledGames = this.games.filter(g => g.status === 'scheduled').length;
        this.finishedGames = this.games.filter(g => g.status === 'finished').length;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading games:', error);
        this.snackBar.open('Error al cargar los juegos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingGame = null;
    this.resetForm();
  }

  hideForm(): void {
    this.showForm = false;
    this.editingGame = null;
  }

  resetForm(): void {
    this.gameForm.reset({
      isActive: true,
      status: 'scheduled',
      attendance: 0
    });
  }

  getFormErrors(): string {
    const errors: string[] = [];
    Object.keys(this.gameForm.controls).forEach(key => {
      const control = this.gameForm.get(key);
      if (control && control.invalid && control.errors) {
        errors.push(`${key}: ${Object.keys(control.errors).join(', ')}`);
      }
    });
    return errors.join('; ');
  }

  private transformFormData(formData: any): any {
    console.log('🏁 Raw game form data:', formData);
    
    // Convertir la fecha y hora del formulario al formato requerido por el backend
    const gameDateTime = formData.dateTime ? new Date(formData.dateTime) : new Date();
    const startTime = gameDateTime.toISOString();
    // Agregar 2 horas por defecto para el tiempo de finalización
    const endDateTime = new Date(gameDateTime.getTime() + (2 * 60 * 60 * 1000));
    const endTime = endDateTime.toISOString();
    
    // Transformar los datos según lo que espera el backend
    const transformedData = {
      name: formData.name?.trim() || '',
      startTime: startTime,
      endTime: endTime,
      localTeam: formData.localTeam ? 
        `http://localhost/api/v1/competencies/teams/${formData.localTeam}/` : 
        'http://localhost/api/v1/competencies/teams/1/',
      visitorTeam: formData.visitorTeam ? 
        `http://localhost/api/v1/competencies/teams/${formData.visitorTeam}/` : 
        'http://localhost/api/v1/competencies/teams/2/',
      phase: formData.phase ? 
        `http://localhost/api/v1/competencies/phases/${formData.phase}/` : 
        'http://localhost/api/v1/competencies/phases/1/',
      gameState: formData.gameState ? 
        `http://localhost/api/v1/competencies/gamestates/${formData.gameState}/` : 
        'http://localhost/api/v1/competencies/gamestates/3/',
      localScore: formData.localScore || 0,
      visitorScore: formData.visitorScore || 0,
      isActive: formData.isActive !== false
    };
    
    console.log('🔄 Transformed game data:', transformedData);
    return transformedData;
  }

  saveGame(): void {
    if (this.gameForm.valid) {
      this.saving = true;
      const rawFormData = this.gameForm.value;
      const transformedData = this.transformFormData(rawFormData);

      console.log('🚀 Sending game data:', JSON.stringify(transformedData, null, 2));

      if (this.editingGame && this.editingGame.id) {
        // Actualizar juego existente
        this.competenciesService.updateGame(this.editingGame.id, transformedData).subscribe({
          next: (updatedGame) => {
            this.showSuccess('Juego actualizado exitosamente');
            this.saving = false;
            this.hideForm();
            this.loadGames();
          },
          error: (error) => {
            console.error('Error updating game:', error);
            this.snackBar.open('Error al actualizar el juego', 'Cerrar', { duration: 3000 });
            this.saving = false;
          }
        });
      } else {
        // Crear nuevo juego
        this.competenciesService.createGame(transformedData).subscribe({
          next: (newGame) => {
            this.showSuccess('Juego creado exitosamente');
            this.saving = false;
            this.hideForm();
            this.loadGames();
          },
          error: (error) => {
            console.error('Error creating game:', error);
            this.snackBar.open('Error al crear el juego', 'Cerrar', { duration: 3000 });
            this.saving = false;
          }
        });
      }
    }
  }

  editGame(game: GameDisplay): void {
    this.editingGame = game;
    // Formatear la fecha para el input datetime-local
    const dateTime = new Date(game.startTime).toISOString().slice(0, 16);
    this.gameForm.patchValue({
      ...game,
      dateTime: dateTime
    });
    this.showForm = true;
  }

  deleteGame(game: GameDisplay): void {
    if (confirm(`¿Está seguro que desea eliminar el juego "${game.name}"?`)) {
      if (game.id) {
        this.competenciesService.deleteGame(game.id).subscribe({
          next: () => {
            this.showSuccess('Juego eliminado exitosamente');
            this.loadGames();
          },
          error: (error) => {
            console.error('Error deleting game:', error);
            this.snackBar.open('Error al eliminar el juego', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  duplicateGame(game: GameDisplay): void {
    const duplicatedGame: GameDisplay = {
      ...game,
      id: this.games.length + 1,
      name: `${game.name} (Copia)`,
      status: 'scheduled',
      localScore: undefined,
      visitorScore: undefined
    };
    this.games.push(duplicatedGame);
    this.dataSource.data = this.games;
    this.showSuccess('Juego duplicado exitosamente');
  }

  updateScore(game: GameDisplay): void {
    this.showInfo('Funcionalidad de actualización de resultado próximamente');
  }

  changeStatus(game: GameDisplay): void {
    this.showInfo('Funcionalidad de cambio de estado próximamente');
  }

  viewDetails(game: GameDisplay): void {
    this.showInfo(`Detalles del juego: ${game.name}`);
  }

  selectGame(game: GameDisplay): void {
    console.log('Selected game:', game);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadGames();
    this.showSuccess('Datos actualizados');
  }

  // Métodos de utilidad para el template
  getTeamName(teamId: number): string {
    const team = this.mockTeams.find(t => t.id === teamId);
    return team ? team.name : 'Equipo desconocido';
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'scheduled': 'schedule',
      'live': 'live_tv',
      'finished': 'check_circle',
      'cancelled': 'cancel',
      'postponed': 'pause_circle'
    };
    return icons[status] || 'help';
  }

  getStatusDisplay(status: string): string {
    const displays: { [key: string]: string } = {
      'scheduled': 'Programado',
      'live': 'En Vivo',
      'finished': 'Finalizado',
      'cancelled': 'Cancelado',
      'postponed': 'Pospuesto'
    };
    return displays[status] || status;
  }

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString('es-ES');
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
