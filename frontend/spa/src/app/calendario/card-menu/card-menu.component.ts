import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {Router} from '@angular/router';
import { MatchtableComponent } from '../matchtable/matchtable.component';
import {SorteoComponent} from '../sorteo/sorteo.component';
@Component({
  selector: 'app-card-menu',
  standalone: true,
    imports: [
        MatIconModule,


    ],
  templateUrl: './card-menu.component.html',
  styleUrl: './card-menu.component.scss'
})
export class CardMenuComponent {
constructor(private router: Router) { }

  navigateToCalendar() {
    this.router.navigate(['/calendario/calendar']);
  }

  navigateToMatchtable() {
    this.router.navigate(['/calendario/matchtable']);
  }
  navigateToSorteo() {
    this.router.navigate(['/calendario/sorteo']);
  }

}
