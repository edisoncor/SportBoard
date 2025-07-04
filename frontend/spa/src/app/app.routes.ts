import { Routes } from '@angular/router';
import { Dashboard } from './feature/dashboard/dashboard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    
    // Rutas de Deportes
    { path: 'deportes', loadComponent: () => import('./feature/deportes/deportes').then(m => m.DeportesComponent) },
    
    // Rutas de Torneos
    { path: 'torneos', loadComponent: () => import('./feature/torneos/torneos').then(m => m.TorneosComponent) },
    
    // Rutas de Equipos
    { path: 'equipos', loadComponent: () => import('./feature/equipos/equipos').then(m => m.EquiposComponent) },
    { path: 'equipos/:id', loadComponent: () => import('./feature/equipo-detalle/equipo-detalle').then(m => m.EquipoDetalleComponent) },
    
    // Rutas de Eventos
    { path: 'eventos', loadComponent: () => import('./feature/eventos/eventos').then(m => m.EventosComponent) },
    { path: 'eventos/crear', loadComponent: () => import('./feature/eventos/eventos').then(m => m.EventosComponent) }, // Se podría crear un componente específico para crear eventos
    
    // Ruta de Calendario
    { path: 'calendario', loadComponent: () => import('./feature/calendario/calendario').then(m => m.CalendarioComponent) },
    
    // Rutas de Estadísticas
    { 
        path: 'estadisticas',
        children: [
            { path: '', redirectTo: 'resumen', pathMatch: 'full' },
            { path: 'resumen', loadComponent: () => import('./feature/estadisticas/resumen/resumen').then(m => m.ResumenComponent) },
            { path: 'rendimiento', loadComponent: () => import('./feature/estadisticas/rendimiento/rendimiento').then(m => m.RendimientoComponent) },
            { path: 'analisis', loadComponent: () => import('./feature/estadisticas/analisis/analisis').then(m => m.AnalisisComponent) }
        ]
    },
    
    // Rutas de Configuración
    { path: 'perfil', loadComponent: () => import('./feature/perfil/perfil').then(m => m.PerfilComponent) },
    { path: 'ajustes', loadComponent: () => import('./feature/ajustes/ajustes').then(m => m.AjustesComponent) },
    { path: 'ayuda', loadComponent: () => import('./feature/ayuda/ayuda').then(m => m.AyudaComponent) },
    
    // Ruta de notificaciones
    { path: 'notificaciones', loadComponent: () => import('./feature/notificaciones/notificaciones').then(m => m.NotificacionesComponent) },
    
    // Ruta de login
    { path: 'login', loadComponent: () => import('./feature/auth/login/login').then(m => m.LoginComponent) },
    
    // Ruta de manejo de errores
    { path: '**', loadComponent: () => import('./feature/error/not-found/not-found').then(m => m.NotFoundComponent) }
];
