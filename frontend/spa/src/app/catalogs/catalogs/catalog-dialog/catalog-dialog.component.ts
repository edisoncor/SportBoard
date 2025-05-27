import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Catalog, CatalogFormValidators } from '../../../models/catalogs/catalog.model';
import { GroupService } from '../../../services/catalogs/group.service';
import { CatalogService } from '../../../services/catalogs/catalog.service'; // Importar CatalogService

@Component({
    selector: 'app-catalog-dialog',
    templateUrl: './catalog-dialog.component.html',
    styleUrls: ['./catalog-dialog.component.scss'],
    standalone: false,
})
export class CatalogDialogComponent implements OnInit {
    catalogForm: FormGroup;
    allGroups: any[] = [];
    allCatalogs: Catalog[] = []; // Nuevo campo agregado

    constructor(
        private fb: FormBuilder,
        private groupService: GroupService,
        private catalogService: CatalogService, // Inyectar CatalogService
        public dialogRef: MatDialogRef<CatalogDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Catalog
    ) {
        this.catalogForm = this.fb.group({
            id: [null], // Campo oculto para el ID
            name: ['', CatalogFormValidators.name],
            group: ['', CatalogFormValidators.group],
            description: [''],
            version: [0, CatalogFormValidators.version],
            isActive: [true, CatalogFormValidators.isActive],
            code: [''],
            groupCode: [''], // Nuevo campo agregado
            idCatalog: [null] // Nuevo campo agregado
        });
    }

    ngOnInit(): void {
        this.groupService.getAllGroups().subscribe(groups => {
            this.allGroups = groups;
            this.catalogService.getCatalogs().subscribe(catalogs => {
                this.allCatalogs = catalogs;
                if (this.data) {
                    this.catalogForm.patchValue(this.data);
                    this.catalogForm.get('id')?.setValue(this.data.id); // Cargar el valor del ID
                    this.catalogForm.get('group')?.setValue(this.data.group?.code); // Cargar el valor del grupo
                    this.catalogForm.get('groupCode')?.setValue(this.data.groupCode); // Cargar el valor del groupCode
                    this.catalogForm.get('version')?.setValue(this.data.version); // Cargar el valor de la versión
                    this.catalogForm.get('idCatalog')?.setValue(this.data.idCatalog); // Cargar el valor del idCatalog
                }
            });
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSaveClick(): void {
        const formValue = this.catalogForm.value;
        formValue.group = this.allGroups.find(group => group.code === formValue.group);
        this.dialogRef.close(formValue);
    }
}
