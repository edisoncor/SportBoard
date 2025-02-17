import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';
import { AlertboxComponent } from './alertbox/alertbox.component';
import { CommonModule } from '@angular/common';

import { User } from '../../models/user_manage/user.model'; 
import { UserService } from '../../services/user_manage/user.service';

export interface PeriodicElement {
  nro: number;
  usuario: string;
  correo: string;

}

@Component({
    selector: 'app-gestion-usuario',
    imports: [SharedModule, CommonModule],
    templateUrl: './gestion-usuario.component.html',
    styleUrls: ['./gestion-usuario.component.scss']
})

export class GestionUsuarioComponent implements OnInit{

  displayedColumns: string[] = ['nro', 'usuario', 'correo', 'acciones'];
  dataSource: PeriodicElement[] = [];

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        // Mapear los datos del backend a la estructura que espera la tabla
        this.dataSource = users.map((user, index) => ({
          nro: index + 1,
          usuario: user.username,
          correo: user.email,
        }));
      },
      error: (err) => {
        console.error('Error al cargar los usuarios:', err);
      }
    });
  }

  readonly dialog = inject(MatDialog);
  openDialogCrearUser() {
    const dialogRef = this.dialog.open(CrearUsuarioComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    throw new Error('Method not implemented.');
  }

  readonly dialog2 = inject(MatDialog);
  openDialogEditUser() {
    const dialogRef2 = this.dialog2.open(EditarUsuarioComponent);
    dialogRef2.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    throw new Error('Method not implemented.');
  }

  readonly dialogAlert = inject(MatDialog);
  openAlertBox() {
    const dialogRef3 = this.dialogAlert.open(AlertboxComponent);
    dialogRef3.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    throw new Error('Method not implemented.');
  }
  showText: boolean = false;
}