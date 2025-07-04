import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './bottom-navigation.html',
  styleUrls: ['./bottom-navigation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavigation implements OnInit, OnDestroy {
  activeRoute: string = '';
  private destroy$ = new Subject<void>();

  // Navigation items configuration
  readonly navigationItems = [
    {
      route: '/dashboard',
      icon: 'dashboard',
      label: 'Inicio',
      ariaLabel: 'Ir al inicio'
    },
    {
      route: '/deportes',
      icon: 'sports_soccer',
      label: 'Deportes',
      ariaLabel: 'Ver deportes disponibles'
    },
    {
      route: '/torneos',
      icon: 'emoji_events',
      label: 'Torneos',
      ariaLabel: 'Ver torneos y competencias'
    },
    {
      route: '/perfil',
      icon: 'person',
      label: 'Perfil',
      ariaLabel: 'Ver perfil de usuario'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Track current route for active styling
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects || event.url;
      this.activeRoute = url.split('/')[1] || 'dashboard';
    });

    // Set initial active route
    const currentUrl = this.router.url;
    this.activeRoute = currentUrl.split('/')[1] || 'dashboard';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle navigation item click with haptic feedback and analytics
   * @param route - The route identifier
   */
  onNavItemClick(route: string): void {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration for tactile feedback
    }

    // Optional: Add analytics tracking here
    // this.analytics.track('bottom_nav_click', { route });

    // Optional: Add custom navigation logic here if needed
    console.log(`Navigating to: ${route}`);
  }

  /**
   * Check if a route is currently active
   * @param route - The route to check
   * @returns boolean indicating if route is active
   */
  isRouteActive(route: string): boolean {
    if (route === 'dashboard') {
      return this.activeRoute === 'dashboard' || this.activeRoute === '';
    }
    return this.activeRoute === route;
  }

  /**
   * Get the full route path for a navigation item
   * @param route - The route identifier
   * @returns The full route path
   */
  getRoutePath(route: string): string {
    const item = this.navigationItems.find(item => item.route.includes(route));
    return item ? item.route : `/${route}`;
  }
}
