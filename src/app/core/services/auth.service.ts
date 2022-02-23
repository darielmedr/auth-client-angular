import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { map, Observable, switchMap, take, tap, timer } from 'rxjs';
import { SessionData } from 'src/app/shared/models/session-data.model';
import { environment } from 'src/environments/environment';
import { StateService } from './state.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl: string = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private router: Router
  ) {}

  public loginWithEmailAndPassword(email: string, password: string): Observable<boolean> {
    return this.http.post<SessionData>(`${this.apiUrl}/sessions`, { email, password }).pipe(
      tap<SessionData>(session => this.stateService.storeSessionData(session)),
      tap<SessionData>(session => this.doSilentRefresh(session.expiresIn)),
      map<SessionData, boolean>(_ => !this.stateService.hasInvalidSessionData())
    );
  }

  public logout(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions`).pipe(
      tap(() => this.cleanSession())
    );
  }

  public refreshToken(): Observable<SessionData> {
    return this.http.post<SessionData>(`${this.apiUrl}/sessions/refresh`, {})
      .pipe(
        tap<SessionData>(session => this.stateService.storeSessionData(session)),
        tap<SessionData>(session => this.doSilentRefresh(session.expiresIn))
      );
  }

  private doSilentRefresh(expiresIn: number): void {
    timer(expiresIn - 1500)  // ExpiresIn (ms) - ms
      .pipe(
        switchMap(() => this.refreshToken()),
        take(1)
      )
      .subscribe();
  }

  public sendForgotPasswordEmail(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgotpassword`, { email });
  }

  public resetPassword(id: string, resetCode: string, password: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/resetpassword/${id}/${resetCode}`,
      { password }
    );
  }

  public cleanSession(): void {
    this.stateService.deleteSessionData();
    this.router.navigate(['/auth'])
  }

  public isLoggedIn(): boolean {
    return (
      !this.stateService.hasInvalidSessionData() &&
      dayjs().isBefore(this.getExpiration())
    );
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  private getExpiration() {
    const expiresAt: number | null = this.stateService.getDataByKey<number>('expires_at');

    return expiresAt
      ? expiresAt
      : dayjs().subtract(1, 'day');
  }
}
