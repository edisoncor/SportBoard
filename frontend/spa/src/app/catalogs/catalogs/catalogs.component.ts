import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    HostListener,
} from '@angular/core';
import { CatalogService } from '../../services/catalogs/catalog.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component'; // Importar BreadcrumbComponent
import { Catalog } from '../../models/catalogs/catalog.model';
import { MatTableDataSource } from '@angular/material/table'; // Importar MatTableDataSource
import { MatPaginator } from '@angular/material/paginator'; // Importar MatPaginator
import { MatSort } from '@angular/material/sort'; // Importar MatSort
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'; // Importar MatDialog y MatDialogConfig
import { CatalogDialogComponent } from './catalog-dialog/catalog-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component'; // Importar ConfirmationDialogComponent
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component'; // Importa el componente
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-catalogs',
    templateUrl: './catalogs.component.html',
    styleUrls: ['./catalogs.component.scss'], // Corregir styleUrl a styleUrls
    standalone: false,
})
export class CatalogsComponent implements OnInit, AfterViewInit {
    breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Catalogs', url: '/catalogos' },
        { label: 'Catálogos', url: '/catalogos/catalogs/' },
    ];
    displayedColumns: string[] = [
        'name',
        'group',
        'description',
        'version',
        'isActive',
        'idCatalog',
        'actions',
    ];
    dataSource = new MatTableDataSource<Catalog>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private catalogService: CatalogService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadCatalogs();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadCatalogs(): void {
        this.catalogService.getCatalogs().subscribe((data: Catalog[]) => {
            this.dataSource.data = data.map(catalog => ({
                ...catalog,
                parentCatalog: data.find(parent => parent.id === catalog.idCatalog)
            }));
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    openCatalogDialog(catalog?: Catalog): void {
        const dialogRef = this.dialog.open(CatalogDialogComponent, {
            width: '350px',
            data: catalog
                ? { ...catalog }
                : {
                      name: '',
                      group: '',
                      description: '',
                      version: 0,
                      isActive: true,
                  },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (catalog && catalog.id) {
                    this.catalogService.updateCatalog(catalog.id, result).subscribe(() => {
                        this.loadCatalogs();
                        this.showFlashMessage(
                            'Catálogo actualizado con éxito',
                            'info'
                        );
                    });
                } else {
                    this.catalogService.createCatalog(result).subscribe(() => {
                        this.loadCatalogs();
                        this.showFlashMessage(
                            'Catálogo creado con éxito',
                            'success'
                        );
                    });
                }
            }
        })
    }

    editCatalog(catalog: Catalog): void {
        this.openCatalogDialog(catalog);
    }

    deleteCatalog(catalog: Catalog): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '250px',
            data: {
                message: '¿Estás seguro de que deseas eliminar este catálogo?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.catalogService.deleteCatalog(catalog.id).subscribe(() => {
                    this.loadCatalogs();
                    this.showFlashMessage(
                        'Catálogo eliminado con éxito',
                        'warning'
                    );
                });
            }
        });
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: Event): void {
        const element = event.target as HTMLElement;
        const atBottom =
            element.scrollHeight - element.scrollTop === element.clientHeight;
        if (atBottom) {
            this.loadMoreCatalogs();
        }
    }

    loadMoreCatalogs(): void {
        // Implementa la lógica para cargar más catálogos aquí
        console.log('Cargar más catálogos...');
    }

    showFlashMessage(
        message: string,
        type: 'success' | 'error' | 'info' | 'warning',
        position: 'top-right' | 'middle-right' | 'bottom-right' = 'top-right',
        duration: number = 3000
    ): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            message,
            type,
            position,
            maxWidth: '90%',
            minWidth: '400px',
            duration,
        };
        dialogConfig.panelClass = 'flash-message-dialog';
        dialogConfig.hasBackdrop = false;

        const flashMessageRef = this.dialog.open(
            FlashMessageComponent,
            dialogConfig
        );

        setTimeout(() => {
            flashMessageRef.close();
        }, duration);
    }
}
