import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [
        MatSidenavModule, 
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatRippleModule,
        MatTooltipModule,
        MatMenuModule
    ],
})
export class SharedModule {}
