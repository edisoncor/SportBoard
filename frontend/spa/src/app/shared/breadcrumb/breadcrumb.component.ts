import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: false,
})
export class BreadcrumbComponent {
    @Input() breadcrumbs: { label: string; url: string }[] = [];
}
