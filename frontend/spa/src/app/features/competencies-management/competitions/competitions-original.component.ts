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

import { Competition } from '../../../core/models/competencies/Competition';
import { Administration } from '../../../core/models/competencies/Administration';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

@Component({
  selector: 'app-competitions',
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
    <div class="competitions-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestión de Competencias</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Nueva Competencia
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <div *ngIf="!loading && competitions.length === 0" class="no-data">
            <mat-icon>sports</mat-icon>
            <p>No hay competencias registradas</p>
          </div>

          <div *ngIf="!loading && competitions.length > 0" class="table-container">
            <table mat-table [dataSource]="paginatedCompetitions" matSort (matSortChange)="sortData($event)" class="competitions-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let competition">{{ competition.name }}</td>
              </ng-container>

              <ng-container matColumnDef="creationDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Creación</th>
                <td mat-cell *matCellDef="let competition">{{ competition.creationDate | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="administration">
                <th mat-header-cell *matHeaderCellDef>Administración</th>
                <td mat-cell *matCellDef="let competition">{{ getAdministrationName(competition.administration) }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let competition">
                  <button mat-icon-button color="primary" (click)="openEditDialog(competition)" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="openDeleteDialog(competition)" title="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator
              [length]="competitions.length"
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
    .competitions-container {
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

    .competitions-table {
      width: 100%;
    }

    mat-card-header {
      display: flex;
      align-items: center;
    }
  `]
})
export class CompetitionsComponent implements OnInit, OnDestroy {
  competitions: Competition[] = [];
  paginatedCompetitions: Competition[] = [];
  administrations: Administration[] = [];
  loading = false;
  pageSize = 10;
  currentPage = 0;

  displayedColumns: string[] = ['name', 'creationDate', 'administration', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private competenciesService: CompetenciesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
    this.loadAdministrations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCompetitions(): void {
    this.loading = true;
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.competitions = [
        {
          id: 1,
          name: 'Liga Nacional 2024',
          creationDate: new Date('2024-01-15'),
          administration: 1,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 2,
          name: 'Copa Apertura 2024',
          creationDate: new Date('2024-01-10'),
          administration: 2,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10')
        }
      ];
      this.updatePaginatedData();
      this.loading = false;
    }, 1000);
  }

  loadAdministrations(): void {
    // Mock data - replace with actual service call
    this.administrations = [
      { id: 1, name: 'Federación Nacional', city: 'Madrid', country: 'España', location: 'Centro', phone: '123456789', province: 'Madrid', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: 2, name: 'Liga Provincial', city: 'Barcelona', country: 'España', location: 'Norte', phone: '987654321', province: 'Barcelona', isActive: true, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ];
  }

  getAdministrationName(administrationId: number): string {
    const administration = this.administrations.find(a => a.id === administrationId);
    return administration ? administration.name : 'N/A';
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCompetitions = this.competitions.slice(startIndex, endIndex);
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

    this.competitions = this.competitions.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'creationDate':
          return this.compare(a.creationDate, b.creationDate, isAsc);
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
    const dialogRef = this.dialog.open(CompetitionDialogComponent, {
      width: '600px',
      data: { 
        competition: null, 
        administrations: this.administrations,
        title: 'Nueva Competencia'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCompetition(result);
      }
    });
  }

  openEditDialog(competition: Competition): void {
    const dialogRef = this.dialog.open(CompetitionDialogComponent, {
      width: '600px',
      data: { 
        competition: { ...competition }, 
        administrations: this.administrations,
        title: 'Editar Competencia'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCompetition(result);
      }
    });
  }

  openDeleteDialog(competition: Competition): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Competencia',
        message: `¿Está seguro que desea eliminar la competencia "${competition.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCompetition(competition.id!);
      }
    });
  }

  createCompetition(competitionData: Partial<Competition>): void {
    // Mock implementation - replace with actual service call
    const newCompetition: Competition = {
      id: this.competitions.length + 1,
      ...competitionData,
      creationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Competition;

    this.competitions.push(newCompetition);
    this.updatePaginatedData();
    this.snackBar.open('Competencia creada exitosamente', 'Cerrar', { duration: 3000 });
  }

  updateCompetition(competitionData: Competition): void {
    // Mock implementation - replace with actual service call
    const index = this.competitions.findIndex(c => c.id === competitionData.id);
    if (index !== -1) {
      this.competitions[index] = { ...competitionData, updatedAt: new Date() };
      this.updatePaginatedData();
      this.snackBar.open('Competencia actualizada exitosamente', 'Cerrar', { duration: 3000 });
    }
  }

  deleteCompetition(id: number): void {
    // Mock implementation - replace with actual service call
    this.competitions = this.competitions.filter(c => c.id !== id);
    this.updatePaginatedData();
    this.snackBar.open('Competencia eliminada exitosamente', 'Cerrar', { duration: 3000 });
  }
}

// Competition Dialog Component
@Component({
  selector: 'app-competition-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="competitionForm" class="competition-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ingrese el nombre de la competencia">
          <mat-error *ngIf="competitionForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Administración</mat-label>
          <mat-select formControlName="administration">
            <mat-option *ngFor="let admin of data.administrations" [value]="admin.id">
              {{ admin.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="competitionForm.get('administration')?.hasError('required')">
            La administración es requerida
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="competitionForm.invalid">
        {{ data.competition ? 'Actualizar' : 'Crear' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .competition-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 500px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class CompetitionDialogComponent implements OnInit {
  competitionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompetitionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.competitionForm = this.fb.group({
      name: ['', Validators.required],
      administration: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.competition) {
      this.competitionForm.patchValue(this.data.competition);
    }
  }

  onSave(): void {
    if (this.competitionForm.valid) {
      const competitionData = { ...this.competitionForm.value };
      if (this.data.competition) {
        competitionData.id = this.data.competition.id;
      }
      this.dialogRef.close(competitionData);
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
