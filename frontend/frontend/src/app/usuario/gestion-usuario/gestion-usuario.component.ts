import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';
import { AlertboxComponent } from './alertbox/alertbox.component';
import { CommonModule } from '@angular/common';

export interface PeriodicElement {
  nro: number;
  usuario: string;
  correo: string;
  rol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { nro: 1, usuario: 'user1', correo: 'user1@unl.edu.ec', rol: 'admin' },
  { nro: 2, usuario: 'user2', correo: 'user2@unl.edu.ec', rol: 'user' },
  { nro: 3, usuario: 'user3', correo: 'user3@unl.edu.ec', rol: 'user' },
  { nro: 4, usuario: 'user4', correo: 'user4@unl.edu.ec', rol: 'admin' },
  { nro: 5, usuario: 'user5', correo: 'user5@unl.edu.ec', rol: 'user' },
  { nro: 6, usuario: 'user6', correo: 'user6@unl.edu.ec', rol: 'admin' },
  { nro: 7, usuario: 'user7', correo: 'user7@unl.edu.ec', rol: 'suer' },
  { nro: 8, usuario: 'user8', correo: 'user8@unl.edu.ec', rol: 'user' },
  { nro: 9, usuario: 'user9', correo: 'user9@unl.edu.ec', rol: 'user' },
  { nro: 12, usuario: 'user12', correo: 'user12@unl.edu.ec', rol: 'user' },
  { nro: 13, usuario: 'user13', correo: 'user13@unl.edu.ec', rol: 'user' },
  { nro: 14, usuario: 'user14', correo: 'user14@unl.edu.ec', rol: 'user' },
  { nro: 15, usuario: 'user15', correo: 'user15@unl.edu.ec', rol: 'user' },
  { nro: 16, usuario: 'user16', correo: 'user16@unl.edu.ec', rol: 'user' },
  { nro: 17, usuario: 'user17', correo: 'user17@unl.edu.ec', rol: 'user' },
  { nro: 18, usuario: 'user18', correo: 'user18@unl.edu.ec', rol: 'user' },
  { nro: 19, usuario: 'user19', correo: 'user19@unl.edu.ec', rol: 'user' },
  { nro: 20, usuario: 'user20', correo: 'user20@unl.edu.ec', rol: 'user' }
];

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './gestion-usuario.component.html',
  styleUrls: ['./gestion-usuario.component.scss'],
})

export class GestionUsuarioComponent {

  displayedColumns: string[] = ['nro', 'usuario', 'correo', 'rol', 'acciones'];
  dataSource = ELEMENT_DATA;

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