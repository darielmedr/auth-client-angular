import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, map, shareReplay } from 'rxjs';
import { LinkRoute } from '../../shared/models/link-route.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();

  public isHandset$: Observable<boolean> = new Observable();

  public featureLinks: LinkRoute[] = [
    {
      name: 'User',
      route: 'user',
      icon: 'manage_accounts'
    },
    {
      name: 'Team',
      route: 'team',
      icon: 'groups'
    }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
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

}
