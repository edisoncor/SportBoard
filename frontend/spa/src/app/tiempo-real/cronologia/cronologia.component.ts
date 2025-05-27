import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TrEstadisticaComponent } from '../tr-estadistica/tr-estadistica.component';
import { MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-cronologia',
    imports: [MatCardModule, MatIconModule, MatTabsModule, MatButtonModule, TrEstadisticaComponent],
    templateUrl: './cronologia.component.html',
    styleUrl: './cronologia.component.scss'
})
export class CronologiaComponent {
  dialog = inject(MatDialog);
  constructor(private router: Router) { }

  navigateToSelec() {
    this.router.navigate(['/tiempo-real']); 
  }

  openDialog(text: string): void {
    let component;
    switch (text) {
      case 'ejemplo1':
        component = ejem;
        break;
      case 'ejemplo2':
        component = TrEstadisticaComponent;
        break;
      default:
        console.error('Componente dsconocido');
        return;
    }
    this.dialog.open(component, {
      width: '300px', // Ajusta el tamaño a tus necesidades
    });
  }
}

@Component({
    selector: '',
    templateUrl: 'ejemploEquipo.html',
    imports: [MatCardModule, MatButtonModule]
})
export class ejem {
}
