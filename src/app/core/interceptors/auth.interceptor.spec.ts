import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const testUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        MockProvider(AuthService, {
          refreshToken: () => EMPTY
        })
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    // assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should set withCredentials to TRUE', () => {
    httpClient.post(testUrl, {}).subscribe();

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.withCredentials).toBeTrue();
  });
});
