import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs-estadisticas',
  templateUrl: './tabs-estadisticas.component.html',
  styleUrls: ['./tabs-estadisticas.component.scss'],
  standalone: false
})
export class TabsEstadisticasComponent {
  activeTab: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.activeTab = params['tab'];
    });
  }

  onTabChange(event: any) {
    const tabLabels = ['competencia-info', 'resultado-estadistica', 'tabla-posiciones', 'jugadores-estadisticas', 'equipos-estadisticas'];
    this.router.navigate([tabLabels[event.index]], { relativeTo: this.route });
  }
}