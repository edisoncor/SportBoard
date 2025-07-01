import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [MatSidenavModule, MatIconModule],
})
export class SharedModule {}
