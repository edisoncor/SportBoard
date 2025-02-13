import { Component } from "@angular/core"
import { EstadisticasService } from "../../services/estadisticas/estadistica.service"

@Component({
  selector: "app-descargas-estadistica",
  templateUrl: "./descargas-estadistica.component.html",
  styleUrls: ["./descargas-estadistica.component.scss"],
  standalone: false,
})
export class DescargasEstadisticaComponent {
  constructor(private estadisticasService: EstadisticasService) {}

  generateAndDownloadPDF(type: string) {
    const data = {} // Aquí puedes agregar datos específicos si es necesario
    let observable

    switch (type) {
      case "teams":
        observable = this.estadisticasService.generateTeamsPDF(data)
        break
      case "matches":
        observable = this.estadisticasService.generateMatchesPDF(data)
        break
      case "players":
        observable = this.estadisticasService.generatePlayersPDF(data)
        break
      case "leaderboard":
        observable = this.estadisticasService.generateLeaderboardPDF(data)
        break
      default:
        console.error("Tipo de PDF no reconocido")
        return
    }

    observable.subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${type}_statistics.pdf`
        link.click()
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        console.error("Error al generar el PDF:", error)
        // Aquí puedes agregar una notificación de error para el usuario
      },
    })
  }
}

