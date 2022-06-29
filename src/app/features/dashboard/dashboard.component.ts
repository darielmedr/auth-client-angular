import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LinkRoute } from 'src/app/shared/models/link-route.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();

  public isHandset$: Observable<boolean> = new Observable();

  public featureLinks: LinkRoute[] = [
    {
      name: 'New item',
      route: 'new-item',
      icon: 'add_task'
    },
    {
      name: 'Category',
      route: 'category',
      icon: 'category'
    },
    {
      name: 'List items',
      route: 'list-items',
      icon: 'receipt_long'
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public logout() {
    this.authService.logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {},
        error: () => {
          this.authService.cleanSession();
        }
      });
  }
}
