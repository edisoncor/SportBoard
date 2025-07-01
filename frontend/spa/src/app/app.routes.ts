import { Routes } from '@angular/router';
import { Dashboard } from './feature/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    // Aquí se pueden agregar más rutas conforme se creen nuevos componentes
];
