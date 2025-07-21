import { Component, inject, signal, computed, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { CatalogService } from '../../../../../core/services/catalogs/catalog.service';
import { Item, getItemCodeFromUrl, hasChildItems } from '../../../../../core/models/catalogs/Item';
import { Category } from '../../../../../core/models/catalogs/Category';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Señales para el estado del componente
  items = signal<Item[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  selectedCategory = signal<string>('');

  // Paginación
  pageSize = signal(10);
  pageIndex = signal(0);
  pageSizeOptions = [5, 10, 25, 50];

  // Columnas de la tabla
  displayedColumns: string[] = ['code', 'name', 'description', 'category', 'isActive', 'actions'];

  // Items filtrados (computed)
  filteredItems = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const categoryFilter = this.selectedCategory();

    return this.items().filter(item => {
      const matchesSearch = search === '' ||
        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        (item.description?.toLowerCase().includes(search) ?? false);

      const matchesCategory = categoryFilter === '' || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  });

  // Items paginados (computed)
  paginatedItems = computed(() => {
    const filtered = this.filteredItems();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return filtered.slice(startIndex, endIndex);
  });

  // Total de items (computed)
  totalItems = computed(() => this.filteredItems().length);

  ngOnInit() {
    this.loadItems();
    this.loadCategories();
  }

  /**
   * Carga todos los items
   */
  loadItems() {
    this.loading.set(true);
    this.catalogService.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando items:', error);
        this.showError('Error al cargar los items');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga todas las categorías para el filtro
   */
  loadCategories() {
    this.catalogService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error cargando categorías:', error);
      }
    });
  }

  /**
   * Abre el diálogo para crear un nuevo item
   */
  openCreateDialog() {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '600px',
      data: {
        mode: 'create',
        categories: this.categories()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createItem(result);
      }
    });
  }

  /**
   * Abre el diálogo para editar un item existente
   */
  openEditDialog(item: Item) {
    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        item: item,
        categories: this.categories()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateItem(getItemCodeFromUrl(item.url), result);
      }
    });
  }

  /**
   * Confirma y elimina un item
   */
  confirmDelete(item: Item) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro de que desea eliminar el item "${item.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteItem(getItemCodeFromUrl(item.url));
      }
    });
  }

  /**
   * Crea un nuevo item
   */
  private createItem(itemData: any) {
    this.catalogService.createItem(itemData).subscribe({
      next: (newItem) => {
        this.items.update(items => [...items, newItem]);
        this.showSuccess('Item creado exitosamente');
      },
      error: (error) => {
        console.error('Error creando item:', error);
        this.showError('Error al crear el item');
      }
    });
  }

  /**
   * Actualiza un item existente
   */
  private updateItem(code: string, itemData: any) {
    this.catalogService.updateItem(code, itemData).subscribe({
      next: (updatedItem) => {
        this.items.update(items =>
          items.map(item =>
            getItemCodeFromUrl(item.url) === code ? updatedItem : item
          )
        );
        this.showSuccess('Item actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error actualizando item:', error);
        this.showError('Error al actualizar el item');
      }
    });
  }

  /**
   * Elimina un item
   */
  private deleteItem(code: string) {
    this.catalogService.deleteItem(code).subscribe({
      next: () => {
        this.items.update(items =>
          items.filter(item => getItemCodeFromUrl(item.url) !== code)
        );
        this.showSuccess('Item eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error eliminando item:', error);
        this.showError('Error al eliminar el item');
      }
    });
  }

  /**
   * Obtiene el código de un item desde su URL
   */
  getItemCode(item: Item): string {
    return getItemCodeFromUrl(item.url);
  }

  /**
   * Verifica si un item tiene elementos hijos
   */
  hasChildren(item: Item): boolean {
    return hasChildItems(item);
  }

  /**
   * Obtiene el nombre de la categoría
   */
  getCategoryName(categoryCode: string): string {
    const category = this.categories().find(cat => cat.code === categoryCode);
    return category?.name || categoryCode;
  }

  /**
   * Limpia los filtros aplicados
   */
  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.resetPagination();
  }

  /**
   * Maneja eventos de paginación
   */
  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  /**
   * Reinicia la paginación a la primera página
   */
  private resetPagination() {
    this.pageIndex.set(0);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  /**
   * Muestra mensaje de éxito
   */
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra mensaje de error
   */
  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
