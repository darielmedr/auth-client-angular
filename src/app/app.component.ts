import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initHandShakeAndGetXSRFToken();

    if (this.authService.isLoggedIn()) {
      this.enableSilentRefreshToken();
    }
  }

  private initHandShakeAndGetXSRFToken(): void {
    this.authService.getXSRFToken().pipe(first()).subscribe();
  }

  private enableSilentRefreshToken(): void {
    this.authService.refreshToken().pipe(first()).subscribe();
  }
}
