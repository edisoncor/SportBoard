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

import { Offer } from '../../../core/models/competencies/Offer';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

// Interfaz extendida para el componente con propiedades adicionales para la UI
interface OfferDisplay extends Offer {
  status?: 'active' | 'inactive' | 'draft' | 'expired';
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-offers',
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
    <div class="offers-container">
      <!-- Encabezado principal -->
      <div class="header-section">
        <div class="title-section">
          <h1 class="page-title">
            <mat-icon class="title-icon">local_offer</mat-icon>
            Gestión de Ofertas
          </h1>
          <p class="page-subtitle">Administre las ofertas y promociones deportivas</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="showCreateForm()" class="create-btn">
            <mat-icon>add_circle</mat-icon>
            Nueva Oferta
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
            <mat-icon class="stat-icon">local_offer</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ totalOffers }}</span>
              <span class="stat-label">Total Ofertas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">flash_on</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ activeOffers }}</span>
              <span class="stat-label">Activas</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">draft</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ draftOffers }}</span>
              <span class="stat-label">Borradores</span>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">star</mat-icon>
            <div class="stat-text">
              <span class="stat-number">{{ staticOffers }}</span>
              <span class="stat-label">Estáticas</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Formulario expandible -->
      <mat-card class="form-card" [class.expanded]="showForm">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ editingOffer ? 'edit' : 'add_circle' }}</mat-icon>
            {{ editingOffer ? 'Editar Oferta' : 'Nueva Oferta' }}
          </mat-card-title>
          <div class="form-actions">
            <button mat-icon-button (click)="hideForm()" matTooltip="Cerrar formulario">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>

        <mat-card-content *ngIf="showForm" class="modern-form">
          <form [formGroup]="offerForm" (ngSubmit)="saveOffer()">
            
            <!-- Información básica -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>info</mat-icon>
                Información Básica
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Nombre de la Oferta</mat-label>
                  <input matInput formControlName="name" placeholder="Ej: Descuento Temporada">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-error *ngIf="offerForm.get('name')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Categoría</mat-label>
                  <mat-select formControlName="category">
                    <mat-option value="discount">Descuento</mat-option>
                    <mat-option value="promotion">Promoción</mat-option>
                    <mat-option value="bonus">Bonus</mat-option>
                    <mat-option value="special">Especial</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>category</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Descripción</mat-label>
                  <textarea matInput formControlName="description" rows="3" 
                           placeholder="Descripción detallada de la oferta"></textarea>
                  <mat-icon matSuffix>description</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Configuración -->
            <div class="form-section">
              <h3 class="section-title">
                <mat-icon>settings</mat-icon>
                Configuración
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fecha de Creación</mat-label>
                  <input matInput [matDatepicker]="creationPicker" formControlName="creationDate">
                  <mat-datepicker-toggle matSuffix [for]="creationPicker"></mat-datepicker-toggle>
                  <mat-datepicker #creationPicker></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Prioridad</mat-label>
                  <mat-select formControlName="priority">
                    <mat-option value="high">Alta</mat-option>
                    <mat-option value="medium">Media</mat-option>
                    <mat-option value="low">Baja</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>priority_high</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                  <mat-label>Fase Asociada</mat-label>
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
                  <mat-label>Estado</mat-label>
                  <mat-select formControlName="status">
                    <mat-option value="active">Activa</mat-option>
                    <mat-option value="inactive">Inactiva</mat-option>
                    <mat-option value="draft">Borrador</mat-option>
                    <mat-option value="expired">Expirada</mat-option>
                  </mat-select>
                  <mat-icon matSuffix>flag</mat-icon>
                </mat-form-field>
              </div>
              <div class="form-row">
                <div class="toggle-field">
                  <mat-slide-toggle formControlName="isStatic" color="primary">
                    <span class="toggle-label">
                      <mat-icon>push_pin</mat-icon>
                      Oferta Estática
                    </span>
                  </mat-slide-toggle>
                  <p class="toggle-description">Las ofertas estáticas permanecen fijas durante toda la competencia</p>
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
                      [disabled]="!offerForm.valid || saving" class="submit-btn">
                <mat-icon>{{ editingOffer ? 'save' : 'add' }}</mat-icon>
                {{ editingOffer ? 'Guardar Cambios' : 'Crear Oferta' }}
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
            Lista de Ofertas
          </mat-card-title>
          <div class="table-actions">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar ofertas</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, categoría...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Cargando ofertas...</p>
          </div>

          <div *ngIf="!loading && offers.length === 0" class="empty-state">
            <mat-icon class="empty-icon">local_offer</mat-icon>
            <h3>No hay ofertas registradas</h3>
            <p>Comience agregando su primera oferta promocional</p>
            <button mat-raised-button color="primary" (click)="showCreateForm()">
              <mat-icon>add_circle</mat-icon>
              Agregar Oferta
            </button>
          </div>

          <div *ngIf="!loading && offers.length > 0" class="table-container">
            <table mat-table [dataSource]="dataSource" class="modern-table" matSort>
              
              <!-- Columna ID -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let offer">
                  <div class="offer-id">
                    <div class="offer-icon">
                      <mat-icon>local_offer</mat-icon>
                    </div>
                    <span class="id-number">{{ offer.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Oferta</th>
                <td mat-cell *matCellDef="let offer">
                  <div class="offer-info">
                    <div class="offer-name">{{ offer.name }}</div>
                    <div class="offer-category">{{ getCategoryDisplay(offer.category) }}</div>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Descripción -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let offer">
                  <div class="description-text">
                    {{ offer.description | slice:0:80 }}
                    <span *ngIf="offer.description && offer.description.length > 80">...</span>
                  </div>
                </td>
              </ng-container>

              <!-- Columna Tipo -->
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let offer">
                  <mat-chip class="type-chip" [class]="getTypeClass(offer.isStatic)">
                    <mat-icon>{{ getTypeIcon(offer.isStatic) }}</mat-icon>
                    {{ getTypeDisplay(offer.isStatic) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Fecha -->
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Creación</th>
                <td mat-cell *matCellDef="let offer">
                  <div class="date-info">
                    <mat-icon>event</mat-icon>
                    {{ formatDate(offer.creationDate) }}
                  </div>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                <td mat-cell *matCellDef="let offer">
                  <mat-chip class="status-chip" [class]="getStatusClass(offer.status)">
                    <mat-icon>{{ getStatusIcon(offer.status) }}</mat-icon>
                    {{ getStatusDisplay(offer.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let offer">
                  <div class="action-buttons">
                    <button mat-icon-button color="primary" 
                            (click)="editOffer(offer)" 
                            matTooltip="Editar oferta">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [matMenuTriggerFor]="actionMenu" 
                            matTooltip="Más opciones">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewDetails(offer)">
                        <mat-icon>info</mat-icon>
                        Ver detalles
                      </button>
                      <button mat-menu-item (click)="duplicateOffer(offer)">
                        <mat-icon>content_copy</mat-icon>
                        Duplicar
                      </button>
                      <button mat-menu-item (click)="toggleStatus(offer)">
                        <mat-icon>{{ offer.status === 'active' ? 'pause' : 'play_arrow' }}</mat-icon>
                        {{ offer.status === 'active' ? 'Desactivar' : 'Activar' }}
                      </button>
                      <mat-divider></mat-divider>
                      <button mat-menu-item (click)="deleteOffer(offer)" class="delete-action">
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
                  (click)="selectOffer(row)"></tr>
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
    .offers-container {
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
      color: #e91e63;
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

    .offer-id {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .offer-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e91e63, #f06292);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .offer-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .id-number {
      font-weight: bold;
      color: #e91e63;
    }

    .offer-info {
      display: flex;
      flex-direction: column;
    }

    .offer-name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .offer-category {
      font-size: 0.8rem;
      color: #666;
    }

    .description-text {
      max-width: 200px;
      line-height: 1.4;
    }

    .type-chip {
      font-size: 0.8rem;
    }

    .type-chip.static {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-chip.dynamic {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-chip {
      font-size: 0.8rem;
    }

    .status-chip.active {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .status-chip.inactive {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-chip.draft {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-chip.expired {
      background-color: #fafafa;
      color: #757575;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .delete-action {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .offers-container {
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
export class OffersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  offers: OfferDisplay[] = [];
  dataSource = new MatTableDataSource<OfferDisplay>([]);
  offerForm: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'description', 'type', 'date', 'status', 'actions'];
  loading = false;
  saving = false;
  showForm = false;
  editingOffer: OfferDisplay | null = null;
  totalOffers = 0;
  activeOffers = 0;
  draftOffers = 0;
  staticOffers = 0;

  mockOffers: OfferDisplay[] = [
    {
      id: 1,
      name: 'Descuento Inscripción Temprana',
      description: 'Descuento del 20% para inscripciones realizadas antes del 15 de febrero',
      creationDate: new Date('2024-01-15'),
      isStatic: true,
      phase: 1,
      status: 'active',
      category: 'discount',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Promoción Equipos Juveniles',
      description: 'Promoción especial para equipos de categorías juveniles con descuentos en uniformes',
      creationDate: new Date('2024-02-01'),
      isStatic: false,
      phase: 1,
      status: 'active',
      category: 'promotion',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Bonus Semifinalistas',
      description: 'Bonus especial para equipos que alcancen las semifinales del torneo',
      creationDate: new Date('2024-02-10'),
      isStatic: true,
      phase: 4,
      status: 'draft',
      category: 'bonus',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Oferta Espectadores VIP',
      description: 'Paquete VIP para espectadores con acceso a zonas preferenciales y catering',
      creationDate: new Date('2024-01-25'),
      isStatic: false,
      phase: 5,
      status: 'active',
      category: 'special',
      priority: 'medium'
    },
    {
      id: 5,
      name: 'Descuento Renovación',
      description: 'Descuento del 15% para equipos que renueven su participación para la próxima temporada',
      creationDate: new Date('2024-01-10'),
      isStatic: true,
      phase: 1,
      status: 'expired',
      category: 'discount',
      priority: 'low'
    }
  ];

  constructor(
    private competenciesService: CompetenciesService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.offerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      creationDate: [new Date(), [Validators.required]],
      isStatic: [false],
      phase: ['', [Validators.required]],
      category: ['', [Validators.required]],
      priority: ['medium', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOffers(): void {
    this.loading = true;
    // Simulación de carga de ofertas
    setTimeout(() => {
      this.offers = this.mockOffers;
      this.dataSource.data = this.offers;
      this.totalOffers = this.offers.length;
      this.activeOffers = this.offers.filter(o => o.status === 'active').length;
      this.draftOffers = this.offers.filter(o => o.status === 'draft').length;
      this.staticOffers = this.offers.filter(o => o.isStatic).length;
      this.loading = false;
    }, 500);
  }

  showCreateForm(): void {
    this.showForm = true;
    this.editingOffer = null;
    this.resetForm();
  }

  hideForm(): void {
    this.showForm = false;
    this.editingOffer = null;
  }

  resetForm(): void {
    this.offerForm.reset({
      creationDate: new Date(),
      isStatic: false,
      priority: 'medium',
      status: 'active'
    });
  }

  saveOffer(): void {
    if (this.offerForm.valid) {
      this.saving = true;
      const offerData = this.offerForm.value;

      // Simulación de guardado
      setTimeout(() => {
        if (this.editingOffer) {
          // Actualizar oferta existente
          const index = this.offers.findIndex(o => o.id === this.editingOffer!.id);
          if (index !== -1) {
            this.offers[index] = { ...this.editingOffer, ...offerData };
            this.dataSource.data = this.offers;
          }
          this.showSuccess('Oferta actualizada exitosamente');
        } else {
          // Crear nueva oferta
          const newOffer: OfferDisplay = {
            id: this.offers.length + 1,
            name: offerData.name,
            description: offerData.description,
            creationDate: offerData.creationDate,
            isStatic: offerData.isStatic,
            phase: offerData.phase,
            ...offerData
          };
          this.offers.push(newOffer);
          this.dataSource.data = this.offers;
          this.showSuccess('Oferta creada exitosamente');
        }
        
        this.saving = false;
        this.hideForm();
        this.loadOffers();
      }, 1000);
    }
  }

  editOffer(offer: OfferDisplay): void {
    this.editingOffer = offer;
    this.offerForm.patchValue(offer);
    this.showForm = true;
  }

  deleteOffer(offer: OfferDisplay): void {
    if (confirm(`¿Está seguro que desea eliminar la oferta "${offer.name}"?`)) {
      const index = this.offers.findIndex(o => o.id === offer.id);
      if (index !== -1) {
        this.offers.splice(index, 1);
        this.dataSource.data = this.offers;
      }
      this.showSuccess('Oferta eliminada exitosamente');
      this.loadOffers();
    }
  }

  duplicateOffer(offer: OfferDisplay): void {
    const duplicatedOffer: OfferDisplay = {
      ...offer,
      id: this.offers.length + 1,
      name: `${offer.name} (Copia)`,
      status: 'draft',
      creationDate: new Date()
    };
    this.offers.push(duplicatedOffer);
    this.dataSource.data = this.offers;
    this.showSuccess('Oferta duplicada exitosamente');
  }

  toggleStatus(offer: OfferDisplay): void {
    offer.status = offer.status === 'active' ? 'inactive' : 'active';
    this.dataSource.data = [...this.offers];
    this.showSuccess(`Oferta ${offer.status === 'active' ? 'activada' : 'desactivada'} exitosamente`);
    this.loadOffers();
  }

  viewDetails(offer: OfferDisplay): void {
    this.showInfo(`Detalles de la oferta: ${offer.name}`);
  }

  selectOffer(offer: OfferDisplay): void {
    console.log('Selected offer:', offer);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshData(): void {
    this.loadOffers();
    this.showSuccess('Datos actualizados');
  }

  // Métodos de utilidad para el template
  getCategoryDisplay(category: string): string {
    const displays: { [key: string]: string } = {
      'discount': 'Descuento',
      'promotion': 'Promoción',
      'bonus': 'Bonus',
      'special': 'Especial'
    };
    return displays[category] || category;
  }

  getTypeClass(isStatic: boolean): string {
    return isStatic ? 'static' : 'dynamic';
  }

  getTypeIcon(isStatic: boolean): string {
    return isStatic ? 'push_pin' : 'dynamic_feed';
  }

  getTypeDisplay(isStatic: boolean): string {
    return isStatic ? 'Estática' : 'Dinámica';
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'active': 'check_circle',
      'inactive': 'cancel',
      'draft': 'edit',
      'expired': 'schedule'
    };
    return icons[status] || 'help';
  }

  getStatusDisplay(status: string): string {
    const displays: { [key: string]: string } = {
      'active': 'Activa',
      'inactive': 'Inactiva',
      'draft': 'Borrador',
      'expired': 'Expirada'
    };
    return displays[status] || status;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
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
