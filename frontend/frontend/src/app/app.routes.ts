import { Routes } from '@angular/router';

export const routes: Routes = [    
    {
        path: 'usuarios',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
    },
];
