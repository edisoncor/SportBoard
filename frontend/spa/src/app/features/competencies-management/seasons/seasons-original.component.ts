import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Season } from '../../../core/models/competencies/Season';
import { Competition } from '../../../core/models/competencies/Competition';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

@Component({
  selector: 'app-seasons',
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
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="seasons-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestión de Temporadas</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Nueva Temporada
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <div *ngIf="!loading && seasons.length === 0" class="no-data">
            <mat-icon>schedule</mat-icon>
            <p>No hay temporadas registradas</p>
          </div>

          <div *ngIf="!loading && seasons.length > 0" class="table-container">
            <table mat-table [dataSource]="paginatedSeasons" matSort (matSortChange)="sortData($event)" class="seasons-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let season">{{ season.name }}</td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let season">{{ season.description }}</td>
              </ng-container>

              <ng-container matColumnDef="startDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Inicio</th>
                <td mat-cell *matCellDef="let season">{{ season.startDate | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="endTime">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Fin</th>
                <td mat-cell *matCellDef="let season">{{ season.endTime | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="competition">
                <th mat-header-cell *matHeaderCellDef>Competencia</th>
                <td mat-cell *matCellDef="let season">{{ getCompetitionName(season.competition) }}</td>
              </ng-container>

              <ng-container matColumnDef="hasEnd">
                <th mat-header-cell *matHeaderCellDef>Finalizada</th>
                <td mat-cell *matCellDef="let season">
                  <span class="status-badge" [class.finished]="season.hasEnd" [class.active]="!season.hasEnd">
                    {{ season.hasEnd ? 'Sí' : 'No' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="champion">
                <th mat-header-cell *matHeaderCellDef>Campeón</th>
                <td mat-cell *matCellDef="let season">{{ season.champion || 'N/A' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let season">
                  <button mat-icon-button color="primary" (click)="openEditDialog(season)" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="openDeleteDialog(season)" title="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator
              [length]="seasons.length"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 20, 50]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .seasons-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-actions {
      margin-left: auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .table-container {
      margin-top: 20px;
    }

    .seasons-table {
      width: 100%;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.finished {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.active {
      background-color: #fff3e0;
      color: #f57c00;
    }

    mat-card-header {
      display: flex;
      align-items: center;
    }
  `]
})
export class SeasonsComponent implements OnInit, OnDestroy {
  seasons: Season[] = [];
  paginatedSeasons: Season[] = [];
  competitions: Competition[] = [];
  loading = false;
  pageSize = 10;
  currentPage = 0;

  displayedColumns: string[] = ['name', 'description', 'startDate', 'endTime', 'competition', 'hasEnd', 'champion', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private competenciesService: CompetenciesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeasons();
    this.loadCompetitions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSeasons(): void {
    this.loading = true;
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.seasons = [
        {
          id: 1,
          name: 'Temporada 2024',
          description: 'Temporada regular 2024',
          startDate: new Date('2024-01-01'),
          endTime: new Date('2024-12-31'),
          champion: 'Real Madrid',
          subChampion: 'Barcelona FC',
          hasEnd: false,
          hasChampion: false,
          competition: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Temporada 2023',
          description: 'Temporada regular 2023',
          startDate: new Date('2023-01-01'),
          endTime: new Date('2023-12-31'),
          champion: 'Barcelona FC',
          subChampion: 'Real Madrid',
          hasEnd: true,
          hasChampion: true,
          competition: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.updatePaginatedData();
      this.loading = false;
    }, 1000);
  }

  loadCompetitions(): void {
    // Mock data - replace with actual service call
    this.competitions = [
      { id: 1, name: 'Liga Nacional 2024', creationDate: new Date(), administration: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Copa Apertura 2024', creationDate: new Date(), administration: 2, createdAt: new Date(), updatedAt: new Date() }
    ];
  }

  getCompetitionName(competitionId: number): string {
    const competition = this.competitions.find(c => c.id === competitionId);
    return competition ? competition.name : 'N/A';
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSeasons = this.seasons.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.seasons = this.seasons.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'startDate':
          return this.compare(a.startDate, b.startDate, isAsc);
        case 'endTime':
          return this.compare(a.endTime, b.endTime, isAsc);
        default:
          return 0;
      }
    });
    this.updatePaginatedData();
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SeasonDialogComponent, {
      width: '600px',
      data: { 
        season: null, 
        competitions: this.competitions,
        title: 'Nueva Temporada'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createSeason(result);
      }
    });
  }

  openEditDialog(season: Season): void {
    const dialogRef = this.dialog.open(SeasonDialogComponent, {
      width: '600px',
      data: { 
        season: { ...season }, 
        competitions: this.competitions,
        title: 'Editar Temporada'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSeason(result);
      }
    });
  }

  openDeleteDialog(season: Season): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Temporada',
        message: `¿Está seguro que desea eliminar la temporada "${season.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSeason(season.id!);
      }
    });
  }

  createSeason(seasonData: Partial<Season>): void {
    // Mock implementation - replace with actual service call
    const newSeason: Season = {
      id: this.seasons.length + 1,
      ...seasonData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Season;

    this.seasons.push(newSeason);
    this.updatePaginatedData();
    this.snackBar.open('Temporada creada exitosamente', 'Cerrar', { duration: 3000 });
  }

  updateSeason(seasonData: Season): void {
    // Mock implementation - replace with actual service call
    const index = this.seasons.findIndex(s => s.id === seasonData.id);
    if (index !== -1) {
      this.seasons[index] = { ...seasonData, updatedAt: new Date() };
      this.updatePaginatedData();
      this.snackBar.open('Temporada actualizada exitosamente', 'Cerrar', { duration: 3000 });
    }
  }

  deleteSeason(id: number): void {
    // Mock implementation - replace with actual service call
    this.seasons = this.seasons.filter(s => s.id !== id);
    this.updatePaginatedData();
    this.snackBar.open('Temporada eliminada exitosamente', 'Cerrar', { duration: 3000 });
  }
}

// Season Dialog Component
@Component({
  selector: 'app-season-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="seasonForm" class="season-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ingrese el nombre de la temporada">
          <mat-error *ngIf="seasonForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Ingrese una descripción"></textarea>
          <mat-error *ngIf="seasonForm.get('description')?.hasError('required')">
            La descripción es requerida
          </mat-error>
        </mat-form-field>

        <div class="date-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha de Inicio</mat-label>
            <input matInput type="date" formControlName="startDate">
            <mat-error *ngIf="seasonForm.get('startDate')?.hasError('required')">
              La fecha de inicio es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha de Fin</mat-label>
            <input matInput type="date" formControlName="endTime">
            <mat-error *ngIf="seasonForm.get('endTime')?.hasError('required')">
              La fecha de fin es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Competencia</mat-label>
          <mat-select formControlName="competition">
            <mat-option *ngFor="let competition of data.competitions" [value]="competition.id">
              {{ competition.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="seasonForm.get('competition')?.hasError('required')">
            La competencia es requerida
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Campeón</mat-label>
          <input matInput formControlName="champion" placeholder="Nombre del campeón (opcional)">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Subcampeón</mat-label>
          <input matInput formControlName="subChampion" placeholder="Nombre del subcampeón (opcional)">
        </mat-form-field>

        <div class="checkbox-row">
          <mat-checkbox formControlName="hasEnd">Temporada Finalizada</mat-checkbox>
          <mat-checkbox formControlName="hasChampion">Tiene Campeón</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="seasonForm.invalid">
        {{ data.season ? 'Actualizar' : 'Crear' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .season-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 500px;
    }

    .full-width {
      width: 100%;
    }

    .date-row {
      display: flex;
      gap: 16px;
    }

    .date-row mat-form-field {
      flex: 1;
    }

    .checkbox-row {
      display: flex;
      gap: 16px;
      margin: 8px 0;
    }
  `]
})
export class SeasonDialogComponent implements OnInit {
  seasonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SeasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.seasonForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endTime: [null, Validators.required],
      competition: [null, Validators.required],
      champion: [''],
      subChampion: [''],
      hasEnd: [false],
      hasChampion: [false]
    });
  }

  ngOnInit(): void {
    if (this.data.season) {
      // Convert dates to YYYY-MM-DD format for input[type="date"]
      const seasonData = { ...this.data.season };
      if (seasonData.startDate) {
        seasonData.startDate = this.formatDateForInput(seasonData.startDate);
      }
      if (seasonData.endTime) {
        seasonData.endTime = this.formatDateForInput(seasonData.endTime);
      }
      this.seasonForm.patchValue(seasonData);
    }
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSave(): void {
    if (this.seasonForm.valid) {
      const seasonData = { ...this.seasonForm.value };
      
      // Convert date strings back to Date objects
      if (seasonData.startDate) {
        seasonData.startDate = new Date(seasonData.startDate);
      }
      if (seasonData.endTime) {
        seasonData.endTime = new Date(seasonData.endTime);
      }
      
      if (this.data.season) {
        seasonData.id = this.data.season.id;
      }
      this.dialogRef.close(seasonData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

// Delete Confirmation Dialog Component
@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">{{ data.confirmText }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DeleteConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
