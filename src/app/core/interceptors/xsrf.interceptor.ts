import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

  #headerName = 'X-XSRF-TOKEN';

  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {


    const csrfToken = this.tokenExtractor.getToken();

    if (csrfToken !== null && !request.headers.has(this.#headerName)) {
      request = request.clone({
        headers: request.headers.set(this.#headerName, csrfToken),
      });
    }

    return next.handle(request);
  }
}

export const xsrfInterceptorProviders = {
  provide: HTTP_INTERCEPTORS,
  useClass: XsrfInterceptor,
  multi: true,
};
