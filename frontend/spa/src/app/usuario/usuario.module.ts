import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioSesionComponent } from './inicio_sesion/inicio_sesion.component';
import { RegistroComponent } from './registro/registro.component';
import { UsuarioRoutingModule } from './usuario-routing.module';


import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogContent } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogActions } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field'; // Importa MatFormFieldModule
import { MatSelectModule } from '@angular/material/select'; // Importa MatSelectModule
import { MatOptionModule } from '@angular/material/core'; // Importa MatOptionModule

import { GestionUsuarioComponent } from './gestion-usuario/gestion-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule, 
    MatIconModule,
    InicioSesionComponent,
    RegistroComponent,
    MatDialogContent,
    MatMenuModule,
    MatDialogActions,
    MatFormFieldModule, 
    MatSelectModule, 
    MatOptionModule,
    GestionUsuarioComponent,
    EditarUsuarioComponent
  
  ],
})
export class UsuarioModule { }
