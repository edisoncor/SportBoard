import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    @Output() toggleSidebar = new EventEmitter<void>();
}
