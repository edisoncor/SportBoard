import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./feature/dashboard/dashboard').then(m => m.Dashboard) },

            // Rutas de Deportes
            { path: 'deportes', loadComponent: () => import('./feature/deportes/deportes').then(m => m.DeportesComponent) },

            // Rutas de Torneos
            { path: 'torneos', loadComponent: () => import('./feature/torneos/torneos').then(m => m.TorneosComponent) },

            // Rutas de Equipos
            { path: 'equipos', loadComponent: () => import('./feature/equipos/equipos').then(m => m.EquiposComponent) },
            { path: 'equipos/:id', loadComponent: () => import('./feature/equipo-detalle/equipo-detalle').then(m => m.EquipoDetalleComponent) },

            // Rutas de Eventos
            { path: 'eventos', loadComponent: () => import('./feature/eventos/eventos').then(m => m.EventosComponent) },
            { path: 'eventos/crear', loadComponent: () => import('./feature/eventos/eventos').then(m => m.EventosComponent) },

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
            {
                path: 'ajustes',
                children: [
                    { path: '', loadComponent: () => import('./feature/ajustes/ajustes').then(m => m.AjustesComponent) },
                    { path: 'categorias', loadComponent: () => import('./feature/ajustes/catalogs/categories.component').then(m => m.CategoriesComponent) },
                    { path: 'items', loadComponent: () => import('./features/ajustes/catalogs/components/items/items.component').then(m => m.ItemsComponent) },
                    
                    // Rutas de gestión de competencias
                    { path: 'reglas', loadComponent: () => import('./features/competencies-management/rules/rules.component').then(m => m.RulesComponent) },
                    { path: 'categorias-competencias', loadComponent: () => import('./features/competencies-management/competency-categories/competency-categories.component').then(m => m.CompetencyCategoriesComponent) },
                    { path: 'estados-juego', loadComponent: () => import('./features/competencies-management/game-states/game-states.component').then(m => m.GameStatesComponent) },
                    { path: 'atletas', loadComponent: () => import('./features/competencies-management/athletes/athletes.component').then(m => m.AthletesComponent) },
                    { path: 'administraciones', loadComponent: () => import('./features/competencies-management/administrations/administrations.component').then(m => m.AdministrationsComponent) },
                    { path: 'equipos-competencias', loadComponent: () => import('./features/competencies-management/teams/teams.component').then(m => m.TeamsComponent) },
                    { path: 'competencias', loadComponent: () => import('./features/competencies-management/competitions/competitions.component').then(m => m.CompetitionsComponent) },
                    { path: 'temporadas', loadComponent: () => import('./features/competencies-management/seasons/seasons.component').then(m => m.SeasonsComponent) },
                    { path: 'fases', loadComponent: () => import('./features/competencies-management/phases/phases.component').then(m => m.PhasesComponent) },
                    { path: 'ofertas', loadComponent: () => import('./features/competencies-management/offers/offers.component').then(m => m.OffersComponent) },
                    { path: 'juegos', loadComponent: () => import('./features/competencies-management/games/games.component').then(m => m.GamesComponent) }
                ]
            },
            { path: 'ayuda', loadComponent: () => import('./feature/ayuda/ayuda').then(m => m.AyudaComponent) },

            // Ruta de notificaciones
            { path: 'notificaciones', loadComponent: () => import('./feature/notificaciones/notificaciones').then(m => m.NotificacionesComponent) },
        ]
    },

    // Rutas de autenticación con AuthLayout
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', loadComponent: () => import('./feature/auth/login/login').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('./feature/auth/register/register').then(m => m.RegisterComponent) },
            { path: 'forgot-password', loadComponent: () => import('./feature/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
            { path: 'reset-password', loadComponent: () => import('./feature/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
        ]
    },

    // Wildcard route for 404 page
    { path: '**', redirectTo: 'dashboard' }
];
