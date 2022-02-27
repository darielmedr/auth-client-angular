import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SessionData } from 'src/app/shared/models/session-data.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  private sessionData$: BehaviorSubject<SessionData | null> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    const clonedReq = request.clone({
      headers: request.headers,
      withCredentials: true
    });

    return next.handle(clonedReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !this.isLoginRequest(clonedReq) &&
          error.status === 401 &&
          error.error !== 'Invalid token'
        ) {
          return this.handle401Error(clonedReq, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private isLoginRequest(req: HttpRequest<unknown>): boolean {
    return (req.url.endsWith('/sessions') && req.method === 'POST');
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if (!this.isRefreshing) {
      return this.authService.refreshToken().pipe(
        switchMap((sessionData: SessionData) => {
          this.isRefreshing = false;
          this.sessionData$.next(sessionData);

          return next.handle(request);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.cleanSession();

          return throwError(() => err);
        })
      );
    }

    return this.sessionData$.pipe(
      filter((sessionData) => !!sessionData),
      take(1),
      switchMap(() => next.handle(request))
    );
  }
}

export const authInterceptorProviders = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
