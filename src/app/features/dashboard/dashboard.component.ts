import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getData() {
    this.http
      .get(`http://localhost:5000/api/users/me`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => console.log(data),
        error: (err) => console.log(err)
      });
  }
}
