import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Team } from '../../../core/models/competencies/Team';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-toolbar color="primary">
              <span>Equipos</span>
              <span class="spacer"></span>
              <button mat-raised-button color="accent" (click)="openCreateDialog()">
                <mat-icon>add</mat-icon>
                Nuevo Equipo
              </button>
            </mat-toolbar>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading spinner -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <!-- Data table -->
          <div *ngIf="!loading" class="table-container">
            <table mat-table [dataSource]="dataSource" mat-sort class="mat-elevation-z8">
              
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let element">{{element.id}}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let element">{{element.name}}</td>
              </ng-container>

              <!-- Foundation Date Column -->
              <ng-container matColumnDef="foundationDate">
                <th mat-header-cell *matHeaderCellDef>Fecha de Fundación</th>
                <td mat-cell *matCellDef="let element">{{formatDate(element.foundationDate)}}</td>
              </ng-container>

              <!-- Administration Column -->
              <ng-container matColumnDef="administration">
                <th mat-header-cell *matHeaderCellDef>Administración</th>
                <td mat-cell *matCellDef="let element">{{getAdministrationDisplay(element.administration)}}</td>
              </ng-container>

              <!-- IsActive Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let element">
                  <span [class]="element.isActive ? 'status-active' : 'status-inactive'">
                    {{element.isActive ? 'Activo' : 'Inactivo'}}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" (click)="openEditDialog(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="openDeleteDialog(element)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .table-container {
      margin-top: 20px;
    }

    table {
      width: 100%;
    }

    .mat-mdc-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .status-active {
      color: #4caf50;
      font-weight: 500;
    }

    .status-inactive {
      color: #f44336;
      font-weight: 500;
    }
  `]
})
export class TeamsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'foundationDate', 'administration', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Team>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private competenciesService: CompetenciesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadTeams();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTeams() {
    this.loading = true;
    // Mock data for now - will be replaced with actual service call
    setTimeout(() => {
      const mockData: Team[] = [
        { 
          id: 1, 
          name: 'Real Madrid', 
          nationality: 1,
          category: 1,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        { 
          id: 2, 
          name: 'FC Barcelona', 
          nationality: 1,
          category: 1,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10')
        },
        { 
          id: 3, 
          name: 'Atlético Madrid', 
          nationality: 1,
          category: 2,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05')
        },
        { 
          id: 4, 
          name: 'Valencia CF', 
          nationality: 1,
          category: 1,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }
      ];
      this.dataSource.data = mockData;
      this.loading = false;
    }, 1000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  getAdministrationDisplay(administration: number | any): string {
    if (typeof administration === 'number') {
      return `Administración ID: ${administration}`;
    }
    if (administration && typeof administration === 'object') {
      return administration.name || `Administración ID: ${administration.id}`;
    }
    return 'Administración no definida';
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(TeamFormDialogComponent, {
      width: '600px',
      data: { team: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  openEditDialog(team: Team) {
    const dialogRef = this.dialog.open(TeamFormDialogComponent, {
      width: '600px',
      data: { team: team, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTeams();
      }
    });
  }

  openDeleteDialog(team: Team) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title: 'Eliminar Equipo',
        message: `¿Está seguro que desea eliminar el equipo "${team.name}"?`,
        entity: team
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTeam(team);
      }
    });
  }

  deleteTeam(team: Team) {
    // TODO: Replace with actual service call
    this.snackBar.open('Equipo eliminado correctamente', 'Cerrar', { duration: 3000 });
    this.loadTeams();
  }
}

// Team Form Dialog Component
@Component({
  selector: 'app-team-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.isEdit ? 'Editar' : 'Crear'}} Equipo</h2>
    
    <form [formGroup]="teamForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ingrese el nombre del equipo">
          <mat-error *ngIf="teamForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Logo (URL)</mat-label>
          <input matInput formControlName="logo" placeholder="Ingrese la URL del logo">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha de Fundación</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="foundationDate" placeholder="Seleccione la fecha">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="teamForm.get('foundationDate')?.hasError('required')">
            La fecha de fundación es requerida
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Administración</mat-label>
          <mat-select formControlName="administration">
            <mat-option value="1">Liga Nacional</mat-option>
            <mat-option value="2">Federación Regional</mat-option>
            <mat-option value="3">Club Deportivo</mat-option>
            <mat-option value="4">Asociación Juvenil</mat-option>
          </mat-select>
          <mat-error *ngIf="teamForm.get('administration')?.hasError('required')">
            La administración es requerida
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="isActive">Equipo Activo</mat-checkbox>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="teamForm.invalid">
          {{data.isEdit ? 'Actualizar' : 'Crear'}}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class TeamFormDialogComponent implements OnInit {
  teamForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TeamFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private competenciesService: CompetenciesService,
    private snackBar: MatSnackBar
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required]],
      logo: [''],
      foundationDate: ['', [Validators.required]],
      administration: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data.isEdit && this.data.team) {
      this.teamForm.patchValue(this.data.team);
    }
  }

  onSubmit() {
    if (this.teamForm.valid) {
      const team: Team = this.teamForm.value;

      if (this.data.isEdit) {
        team.id = this.data.team.id;
        // TODO: Replace with actual service call
        this.snackBar.open('Equipo actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      } else {
        // TODO: Replace with actual service call
        this.snackBar.open('Equipo creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}

// Delete Confirmation Dialog Component
@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    
    <mat-dialog-content>
      <p>{{data.message}}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        <mat-icon>delete</mat-icon>
        Eliminar
      </button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
