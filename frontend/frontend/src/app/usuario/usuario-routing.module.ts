import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './inicio_sesion/inicio_sesion.component';
import { RegistroComponent } from './registro/registro.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';

const routes: Routes = [
  {path: 'inicio-sesion', component: InicioSesionComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'crear-usuario', component: CrearUsuarioComponent},
  {path: 'gestion-usuario', component: GestionUsuarioComponent},
  {path: 'editar-usuario', component: EditarUsuarioComponent},
  { path: '', redirectTo: 'gestion-usuario', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
