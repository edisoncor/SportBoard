import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './groups/groups.component';
import { CatalogsComponent } from './catalogs/catalogs.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'catalogs', component: CatalogsComponent },
    { path: 'groups', component: GroupsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CatalogsRoutingModule {}
