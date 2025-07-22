import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { CatalogService } from '../../core/services/catalogs';
import { Category, Item } from '../../core/models/catalogs';

/**
 * Componente de ejemplo que demuestra el uso del CatalogService
 * Este componente puede servir como referencia para implementar
 * la funcionalidad de catálogos en otros componentes
 */
@Component({
  selector: 'app-catalog-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="catalog-container">
      <h2>Ejemplo de uso del CatalogService</h2>

      <!-- Categorías -->
      <section class="categories-section">
        <h3>Categorías</h3>
        <div *ngIf="categories$ | async as categories; else loadingCategories">
          <p><strong>Total de categorías cargadas: {{categories.length}}</strong></p>
          <div *ngFor="let category of categories.slice(0, 5)" class="category-item">
            <h4>{{ category.name }} ({{ category.code }})</h4>
            <p>{{ category.description }}</p>
            <small>Nivel: {{ category.level }} | Activa: {{ category.isActive ? 'Sí' : 'No' }}</small>
          </div>
          <p *ngIf="categories.length > 5"><em>Mostrando las primeras 5 de {{categories.length}} categorías...</em></p>
        </div>
        <ng-template #loadingCategories>
          <p>Cargando categorías...</p>
        </ng-template>
      </section>

      <!-- Items -->
      <section class="items-section">
        <h3>Items</h3>
        <div *ngIf="items$ | async as items; else loadingItems">
          <p><strong>Total de items cargados: {{items.length}}</strong></p>
          <div *ngFor="let item of items.slice(0, 5)" class="item-card">
            <h4>{{ item.name }}</h4>
            <p>{{ item.description }}</p>
            <p><strong>Código:</strong> {{ item.code }}</p>
            <small>Categoría: {{ item.category }} | Activo: {{ item.isActive ? 'Sí' : 'No' }}</small>
          </div>
          <p *ngIf="items.length > 5"><em>Mostrando los primeros 5 de {{items.length}} items...</em></p>
        </div>
        <ng-template #loadingItems>
          <p>Cargando items...</p>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .catalog-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .categories-section, .items-section {
      margin-bottom: 40px;
    }

    .category-item, .item-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background-color: #f9f9f9;
    }

    .category-item h4, .item-card h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .category-item p, .item-card p {
      margin: 4px 0;
      color: #666;
    }

    .category-item small, .item-card small {
      color: #888;
      font-size: 0.85em;
    }

    h2, h3 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 8px;
    }
  `]
})
export class CatalogExampleComponent implements OnInit {
  private catalogService = inject(CatalogService);

  categories$!: Observable<Category[]>;
  items$!: Observable<Item[]>;

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carga los datos de categorías e items
   */
  private loadData(): void {
    this.categories$ = this.catalogService.getCategories();
    this.items$ = this.catalogService.getItems();
  }

  /**
   * Ejemplo de método para crear una nueva categoría
   */
  createExampleCategory(): void {
    const newCategory = {
      name: 'Nueva Categoría',
      code: 'NEW_CAT_001',
      description: 'Descripción de ejemplo',
      level: 1
    };

    this.catalogService.createCategory(newCategory).subscribe({
      next: (category) => {
        console.log('Categoría creada:', category);
        this.loadData(); // Recargar datos
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
      }
    });
  }

  /**
   * Ejemplo de método para crear un nuevo item
   */
  createExampleItem(): void {
    const newItem = {
      name: 'Nuevo Item',
      code: 'NEW_ITEM_001',
      description: 'Descripción del nuevo item',
      category: 'PAIS' // Usando código de categoría en lugar de ID
    };

    this.catalogService.createItem(newItem).subscribe({
      next: (item) => {
        console.log('Item creado:', item);
        this.loadData(); // Recargar datos
      },
      error: (error) => {
        console.error('Error al crear item:', error);
      }
    });
  }
}
