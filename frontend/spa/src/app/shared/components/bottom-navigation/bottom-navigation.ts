import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './bottom-navigation.html',
  styleUrls: ['./bottom-navigation.scss']
})
export class BottomNavigation implements OnInit {
  activeRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Track current route for active styling
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.activeRoute = url.split('/')[1] || 'dashboard';
    });
  }
}
