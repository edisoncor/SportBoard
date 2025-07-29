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

import { Administration } from '../../../core/models/competencies/Administration';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

@Component({
  selector: 'app-administrations',
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
    MatSelectModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-toolbar color="primary">
              <span>Administraciones</span>
              <span class="spacer"></span>
              <button mat-raised-button color="accent" (click)="openCreateDialog()">
                <mat-icon>add</mat-icon>
                Nueva Administración
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

              <!-- Phone Column -->
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Teléfono</th>
                <td mat-cell *matCellDef="let element">{{element.phone}}</td>
              </ng-container>

              <!-- City Column -->
              <ng-container matColumnDef="city">
                <th mat-header-cell *matHeaderCellDef>Ciudad</th>
                <td mat-cell *matCellDef="let element">{{element.city}}</td>
              </ng-container>

              <!-- Province Column -->
              <ng-container matColumnDef="province">
                <th mat-header-cell *matHeaderCellDef>Provincia</th>
                <td mat-cell *matCellDef="let element">{{element.province}}</td>
              </ng-container>

              <!-- Country Column -->
              <ng-container matColumnDef="country">
                <th mat-header-cell *matHeaderCellDef>País</th>
                <td mat-cell *matCellDef="let element">{{element.country}}</td>
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
export class AdministrationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'city', 'province', 'country', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Administration>();
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
    this.loadAdministrations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAdministrations() {
    this.loading = true;
    // Mock data for now - will be replaced with actual service call
    setTimeout(() => {
      const mockData: Administration[] = [
        { 
          id: 1, 
          name: 'Liga Nacional', 
          phone: '+1234567890',
          city: 'Madrid',
          province: 'Madrid',
          country: 'España',
          location: 'Estadio Nacional',
          isActive: true 
        },
        { 
          id: 2, 
          name: 'Federación Regional', 
          phone: '+1234567891',
          city: 'Barcelona',
          province: 'Cataluña',
          country: 'España',
          location: 'Centro Deportivo Barcelona',
          isActive: true 
        },
        { 
          id: 3, 
          name: 'Club Deportivo', 
          phone: '+1234567892',
          city: 'Valencia',
          province: 'Valencia',
          country: 'España',
          location: 'Polideportivo Municipal',
          isActive: true 
        },
        { 
          id: 4, 
          name: 'Asociación Juvenil', 
          phone: '+1234567893',
          city: 'Sevilla',
          province: 'Andalucía',
          country: 'España',
          location: 'Centro Juvenil',
          isActive: false 
        }
      ];
      this.dataSource.data = mockData;
      this.loading = false;
    }, 1000);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdministrationFormDialogComponent, {
      width: '600px',
      data: { administration: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAdministrations();
      }
    });
  }

  openEditDialog(administration: Administration) {
    const dialogRef = this.dialog.open(AdministrationFormDialogComponent, {
      width: '600px',
      data: { administration: administration, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAdministrations();
      }
    });
  }

  openDeleteDialog(administration: Administration) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title: 'Eliminar Administración',
        message: `¿Está seguro que desea eliminar la administración "${administration.name}"?`,
        entity: administration
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAdministration(administration);
      }
    });
  }

  deleteAdministration(administration: Administration) {
    // TODO: Replace with actual service call
    this.snackBar.open('Administración eliminada correctamente', 'Cerrar', { duration: 3000 });
    this.loadAdministrations();
  }
}

// Administration Form Dialog Component
@Component({
  selector: 'app-administration-form-dialog',
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
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.isEdit ? 'Editar' : 'Crear'}} Administración</h2>
    
    <form [formGroup]="administrationForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ingrese el nombre de la administración">
          <mat-error *ngIf="administrationForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="phone" placeholder="Ingrese el teléfono">
          <mat-error *ngIf="administrationForm.get('phone')?.hasError('required')">
            El teléfono es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ciudad</mat-label>
          <input matInput formControlName="city" placeholder="Ingrese la ciudad">
          <mat-error *ngIf="administrationForm.get('city')?.hasError('required')">
            La ciudad es requerida
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Provincia</mat-label>
          <input matInput formControlName="province" placeholder="Ingrese la provincia">
          <mat-error *ngIf="administrationForm.get('province')?.hasError('required')">
            La provincia es requerida
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>País</mat-label>
          <input matInput formControlName="country" placeholder="Ingrese el país">
          <mat-error *ngIf="administrationForm.get('country')?.hasError('required')">
            El país es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ubicación</mat-label>
          <textarea matInput formControlName="location" placeholder="Ingrese la ubicación" rows="2"></textarea>
          <mat-error *ngIf="administrationForm.get('location')?.hasError('required')">
            La ubicación es requerida
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="isActive">Administración Activa</mat-checkbox>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="administrationForm.invalid">
          {{data.isEdit ? 'Actualizar' : 'Crear'}}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class AdministrationFormDialogComponent implements OnInit {
  administrationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AdministrationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private competenciesService: CompetenciesService,
    private snackBar: MatSnackBar
  ) {
    this.administrationForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      location: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data.isEdit && this.data.administration) {
      this.administrationForm.patchValue(this.data.administration);
    }
  }

  onSubmit() {
    if (this.administrationForm.valid) {
      const administration: Administration = this.administrationForm.value;

      if (this.data.isEdit) {
        administration.id = this.data.administration.id;
        // TODO: Replace with actual service call
        this.snackBar.open('Administración actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      } else {
        // TODO: Replace with actual service call
        this.snackBar.open('Administración creada correctamente', 'Cerrar', { duration: 3000 });
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
