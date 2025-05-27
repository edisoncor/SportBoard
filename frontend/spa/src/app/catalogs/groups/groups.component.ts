import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Group } from '../../models/catalogs/group.model';
import { GroupService } from '../../services/catalogs/group.service';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { FlashMessageComponent } from '../../shared/flash-message/flash-message.component'; // Importa el componente

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
    standalone: false,
})
export class GroupsComponent implements OnInit, AfterViewInit {
    breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Catalogs', url: '/catalogos' },
        { label: 'Groups', url: '/catalogos/groups' }
    ];
    groups: Group[] = [];
    dataSource = new MatTableDataSource<Group>();
    displayedColumns: string[] = ['code', 'name', 'parentCode', 'actions'];
    @ViewChild('addButton') addButton!: ElementRef<HTMLButtonElement>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private groupService: GroupService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.loadGroups();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadGroups(): void {
        this.groupService.getAllGroups().subscribe((data: Group[]) => {
            this.groups = data;
            this.dataSource.data = this.groups;
        });
    }

    openDialog(group?: Group): void {
        const dialogRef = this.dialog.open(GroupDialogComponent, {
            width: '350px',
            data: group
                ? { ...group }
                : {
                      code: '',
                      name: '',
                      parentCode: '',
                      description: '',
                      isActive: true,
                      version: 0,
                  },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result.code) {
                    this.groupService
                        .updateGroup(result.code, result)
                        .subscribe(() => {
                            this.loadGroups();
                            this.showFlashMessage(
                                'Grupo actualizado con éxito',
                                'info'
                            );
                        });
                } else {
                    this.groupService.createGroup(result).subscribe(() => {
                        this.loadGroups();
                        this.showFlashMessage(
                            'Grupo creado con éxito',
                            'success'
                        );
                    });
                }
            }
        });
    }

    selectGroup(group: Group): void {
        this.openDialog(group);
    }

    deleteGroup(code: string): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '250px',
            data: {
                message: '¿Estás seguro de que deseas eliminar este grupo?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.groupService.deleteGroup(code).subscribe(() => {
                    this.loadGroups();
                    this.showFlashMessage(
                        'Grupo eliminado con éxito',
                        'warning'
                    );
                });
            }
        });
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
