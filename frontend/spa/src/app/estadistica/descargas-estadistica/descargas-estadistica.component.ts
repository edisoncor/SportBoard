import { Component } from "@angular/core";
import { EstadisticasService } from "../../services/estadisticas/estadistica.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { catchError, finalize, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-descargas-estadistica",
  templateUrl: "./descargas-estadistica.component.html",
  styleUrls: ["./descargas-estadistica.component.scss"],
  standalone: false,
})
export class DescargasEstadisticaComponent {
  isLoading = false;

  constructor(
    private estadisticasService: EstadisticasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  openConfirmDialog(type: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: { type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.generateAndDownloadPDF(type);
      }
    });
  }

  private generateAndDownloadPDF(type: string) {
    this.isLoading = true;
    this.estadisticasService.generateAndDownloadPDF(type)
      .pipe(
        catchError(error => {
          console.error("Error al generar y descargar el PDF:", error);
          this.showErrorMessage(error.message || "Ocurrió un error al generar el PDF. Por favor, intente nuevamente.");
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response?.content && response?.filename) {
            this.downloadPDF(response.content, response.filename);
          } else if (response) {
            this.showErrorMessage("El PDF se generó pero no se pudo descargar. Por favor, intente nuevamente.");
          } else {
            this.showErrorMessage("Error al procesar el PDF");
          }
        },
        error: (error) => {
          console.error("Error en la descarga:", error);
          this.showErrorMessage(error.message || "Error al descargar el PDF. Por favor, intente nuevamente.");
        }
      });
  }

  private downloadPDF(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log("PDF descargado como:", filename);
    this.showSuccessMessage("PDF descargado exitosamente");
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }


}