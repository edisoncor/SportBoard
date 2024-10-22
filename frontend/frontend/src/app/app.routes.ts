import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'usuarios',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
    },
    {
        path: 'competencias',
        loadChildren: () => import('./competencias/competencias.module').then(m => m.CompetenciasModule)
    },
    {
        path: 'calendario',
        loadChildren: () => import('./calendario/calendario.module').then(m => m.CalendarioModule)
    },
    {
        path: 'tiempo-real',
        loadChildren: () => import('./tiempo-real/tiempo-real.module').then(m => m.TiempoRealModule)
    },
    {
        path: 'estadisticas',
        loadChildren: () => import('./estadistica/estadistica.module').then(m => m.EstadisticaModule)
    },
]   ;
