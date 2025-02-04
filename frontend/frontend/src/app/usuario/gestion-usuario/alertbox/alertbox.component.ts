import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-alertbox',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './alertbox.component.html',
  styleUrl: './alertbox.component.scss'
})

export class AlertboxComponent {

}