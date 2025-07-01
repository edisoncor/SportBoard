import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-navigation',
    imports: [MatListModule, MatIconModule],
    templateUrl: './navigation.html',
    styleUrl: './navigation.scss',
})
export class Navigation {}
