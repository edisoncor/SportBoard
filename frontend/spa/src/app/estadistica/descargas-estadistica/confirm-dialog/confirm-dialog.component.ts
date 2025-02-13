import { Component, Inject } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

@Component({
  selector: "app-confirm-dialog",
  template: `
    <h2 mat-dialog-title>Confirmar Descarga</h2>
    <mat-dialog-content>
      <p>¿Está seguro que desea descargar las estadísticas de {{ getTypeLabel() }}?</p>
      <p *ngIf="data.type === 'matches'">Se descargarán todos los partidos registrados hasta el momento.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button color="primary" [mat-dialog-close]="true">Descargar</button>
    </mat-dialog-actions>
  `,
  standalone: false,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  getTypeLabel(): string {
    switch (this.data.type) {
      case "teams":
        return "Equipos"
      case "matches":
        return "Partidos"
      case "players":
        return "Jugadores"
      case "leaderboard":
        return "Tabla de Posiciones"
      default:
        return ""
    }
  }
}

