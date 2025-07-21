import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Componente de ejemplo para probar la navegación a categorías
 */
@Component({
  selector: 'app-catalog-demo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>category</mat-icon>
            Demo del CRUD de Categorías
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <p>El CRUD de categorías ha sido implementado exitosamente.</p>
          <p>Características incluidas:</p>
          <ul>
            <li>✅ Listado de categorías con filtros</li>
            <li>✅ Crear nuevas categorías</li>
            <li>✅ Editar categorías existentes</li>
            <li>✅ Eliminar categorías con confirmación</li>
            <li>✅ Activar/Desactivar categorías</li>
            <li>✅ Jerarquía de categorías</li>
            <li>✅ Interfaz responsive</li>
          </ul>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/ajustes/categorias">
            <mat-icon>settings</mat-icon>
            Ir a Gestión de Categorías
          </button>
          <button mat-button routerLink="/ajustes">
            <mat-icon>arrow_back</mat-icon>
            Volver a Ajustes
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class CatalogDemoComponent {}
