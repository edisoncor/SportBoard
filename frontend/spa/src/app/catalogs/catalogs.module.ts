import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { GroupsComponent } from './groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { GroupService } from '../services/catalogs/group.service';
import { GroupDialogComponent } from './groups/group-dialog/group-dialog.component';
import { CatalogDialogComponent } from './catalogs/catalog-dialog/catalog-dialog.component';

@NgModule({
    declarations: [
        CatalogsComponent,
        GroupsComponent,
        GroupDialogComponent,
        DashboardComponent,
        CatalogDialogComponent,
    ],
    providers: [
        GroupService
    ],
    imports: [CommonModule, CatalogsRoutingModule, SharedModule],
})
export class CatalogsModule {}
