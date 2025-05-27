import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-breadcrumb-competencias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './breadcrumb-competencias.component.html',
  styleUrls: ['./breadcrumb-competencias.component.scss']
})
export class BreadcrumbCompetenciasComponent implements OnInit {
  @Input() set currentRoute(route: string) {
    if (route) {
      this.updateBreadcrumbs(route);
    }
  }

  breadcrumbs: { label: string; url: string }[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.currentRoute) {
          this.updateBreadcrumbs(this.router.url);
        }
      });
  }

  private updateBreadcrumbs(route: string) {
    // Limpiar la ruta de query params
    const cleanRoute = route.split('?')[0];

    // Dividir la ruta en segmentos
    const pathSegments = cleanRoute.split('/')
      .filter(segment => segment.length > 0);

    // Construir los breadcrumbs
    this.breadcrumbs = pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = this.formatLabel(segment);
      return { url, label };
    });

    // Agregar el inicio
    this.breadcrumbs.unshift({ label: 'Inicio', url: '/' });
  }

  private formatLabel(segment: string): string {
    // Convertir guiones y guiones bajos a espacios
    const withSpaces = segment.replace(/[-_]/g, ' ');
    // Capitalizar cada palabra
    return withSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
