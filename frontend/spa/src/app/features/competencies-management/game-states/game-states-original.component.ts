import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { GameState } from '../../../core/models/competencies/GameState';
import { CompetenciesService } from '../../../core/services/competencies/competencies.service';

@Component({
  selector: 'app-game-states',
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
    MatCheckboxModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-toolbar color="primary">
              <span>Estados de Juego</span>
              <span class="spacer"></span>
              <button mat-raised-button color="accent" (click)="openCreateDialog()">
                <mat-icon>add</mat-icon>
                Nuevo Estado
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

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let element">{{element.description}}</td>
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
export class GameStatesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<GameState>();
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
    this.loadGameStates();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadGameStates() {
    this.loading = true;
    // Mock data for now - will be replaced with actual service call
    setTimeout(() => {
      const mockData: GameState[] = [
        { id: 1, name: 'En progreso', description: 'El juego está en curso', isActive: true },
        { id: 2, name: 'Finalizado', description: 'El juego ha terminado', isActive: true },
        { id: 3, name: 'Suspendido', description: 'El juego ha sido suspendido temporalmente', isActive: true },
        { id: 4, name: 'Cancelado', description: 'El juego ha sido cancelado', isActive: false }
      ];
      this.dataSource.data = mockData;
      this.loading = false;
    }, 1000);

    // TODO: Replace with actual service call
    // this.competenciesService.getGameStates().subscribe({
    //   next: (gameStates) => {
    //     this.dataSource.data = gameStates;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.snackBar.open('Error al cargar estados de juego', 'Cerrar', { duration: 3000 });
    //     this.loading = false;
    //   }
    // });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(GameStateFormDialogComponent, {
      width: '500px',
      data: { gameState: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGameStates();
      }
    });
  }

  openEditDialog(gameState: GameState) {
    const dialogRef = this.dialog.open(GameStateFormDialogComponent, {
      width: '500px',
      data: { gameState: gameState, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGameStates();
      }
    });
  }

  openDeleteDialog(gameState: GameState) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { 
        title: 'Eliminar Estado de Juego',
        message: `¿Está seguro que desea eliminar el estado "${gameState.name}"?`,
        entity: gameState
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGameState(gameState);
      }
    });
  }

  deleteGameState(gameState: GameState) {
    // TODO: Replace with actual service call
    this.snackBar.open('Estado de juego eliminado correctamente', 'Cerrar', { duration: 3000 });
    this.loadGameStates();

    // this.competenciesService.deleteGameState(gameState.id!).subscribe({
    //   next: () => {
    //     this.snackBar.open('Estado de juego eliminado correctamente', 'Cerrar', { duration: 3000 });
    //     this.loadGameStates();
    //   },
    //   error: (error) => {
    //     this.snackBar.open('Error al eliminar estado de juego', 'Cerrar', { duration: 3000 });
    //   }
    // });
  }
}

// Game State Form Dialog Component
@Component({
  selector: 'app-game-state-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.isEdit ? 'Editar' : 'Crear'}} Estado de Juego</h2>
    
    <form [formGroup]="gameStateForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ingrese el nombre del estado">
          <mat-error *ngIf="gameStateForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" placeholder="Ingrese la descripción" rows="3"></textarea>
        </mat-form-field>

        <mat-checkbox formControlName="isActive">Estado Activo</mat-checkbox>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="gameStateForm.invalid">
          {{data.isEdit ? 'Actualizar' : 'Crear'}}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class GameStateFormDialogComponent implements OnInit {
  gameStateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<GameStateFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private competenciesService: CompetenciesService,
    private snackBar: MatSnackBar
  ) {
    this.gameStateForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data.isEdit && this.data.gameState) {
      this.gameStateForm.patchValue(this.data.gameState);
    }
  }

  onSubmit() {
    if (this.gameStateForm.valid) {
      const gameState: GameState = this.gameStateForm.value;

      if (this.data.isEdit) {
        gameState.id = this.data.gameState.id;
        // TODO: Replace with actual service call
        this.snackBar.open('Estado de juego actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);

        // this.competenciesService.updateGameState(gameState.id!, gameState).subscribe({
        //   next: () => {
        //     this.snackBar.open('Estado de juego actualizado correctamente', 'Cerrar', { duration: 3000 });
        //     this.dialogRef.close(true);
        //   },
        //   error: (error) => {
        //     this.snackBar.open('Error al actualizar estado de juego', 'Cerrar', { duration: 3000 });
        //   }
        // });
      } else {
        // TODO: Replace with actual service call
        this.snackBar.open('Estado de juego creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);

        // this.competenciesService.createGameState(gameState).subscribe({
        //   next: () => {
        //     this.snackBar.open('Estado de juego creado correctamente', 'Cerrar', { duration: 3000 });
        //     this.dialogRef.close(true);
        //   },
        //   error: (error) => {
        //     this.snackBar.open('Error al crear estado de juego', 'Cerrar', { duration: 3000 });
        //   }
        // });
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

// Missing imports
import { Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
