import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

/**
 * Componente de diálogo de confirmación reutilizable
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header" [class]="data.type || 'info'">
        <mat-icon class="dialog-icon">{{ getIcon() }}</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>

      <mat-dialog-content class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button
                [mat-dialog-close]="false"
                class="cancel-button">
          <mat-icon>cancel</mat-icon>
          {{ data.cancelText || 'Cancelar' }}
        </button>

        <button mat-raised-button
                [color]="getButtonColor()"
                [mat-dialog-close]="true"
                class="confirm-button">
          <mat-icon>{{ getConfirmIcon() }}</mat-icon>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 300px;
      max-width: 500px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 24px 16px 24px;
      border-radius: 4px 4px 0 0;
    }

    .dialog-header.info {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .dialog-header.warning {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .dialog-header.danger {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .dialog-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .dialog-content {
      padding: 16px 24px;
    }

    .dialog-message {
      margin: 0;
      color: #666;
      line-height: 1.5;
      font-size: 1rem;
    }

    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
      justify-content: flex-end;
    }

    .cancel-button,
    .confirm-button {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 100px;
    }

    .cancel-button {
      color: #666;
    }

    @media (max-width: 480px) {
      .confirm-dialog {
        min-width: unset;
        width: 90vw;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        gap: 8px;
      }

      .cancel-button,
      .confirm-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  /**
   * Obtiene el icono según el tipo de diálogo
   */
  getIcon(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'dangerous';
      case 'info':
      default:
        return 'info';
    }
  }

  /**
   * Obtiene el color del botón de confirmación
   */
  getButtonColor(): string {
    switch (this.data.type) {
      case 'danger':
        return 'warn';
      case 'warning':
        return 'accent';
      case 'info':
      default:
        return 'primary';
    }
  }

  /**
   * Obtiene el icono del botón de confirmación
   */
  getConfirmIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'delete';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'check';
    }
  }
}
