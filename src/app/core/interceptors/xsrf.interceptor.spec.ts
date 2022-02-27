import { HttpClient, HttpXsrfTokenExtractor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { XsrfInterceptor } from './xsrf.interceptor';

describe('XsrfInterceptor', () => {
  let interceptor: XsrfInterceptor;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let tokenExtractorSpy: jasmine.SpyObj<HttpXsrfTokenExtractor>;

  const testUrl = 'http://localhost:5000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        XsrfInterceptor,{
          provide: HTTP_INTERCEPTORS,
          useClass: XsrfInterceptor,
          multi: true
        },
        MockProvider(HttpXsrfTokenExtractor, {
          getToken: () => 'initial token value'
        })
      ]
    });

    interceptor = TestBed.inject(XsrfInterceptor);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    tokenExtractorSpy = TestBed.inject(HttpXsrfTokenExtractor) as jasmine.SpyObj<HttpXsrfTokenExtractor>;
  });

  afterEach(() => {
    // assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it("should set header 'X-XSRF-TOKEN' with extracted xsrf token", () => {
    const headerName = 'X-XSRF-TOKEN';
    const mockToken = 'mock xsrf token';

    spyOn(tokenExtractorSpy, 'getToken').and.returnValue(mockToken);

    httpClient.post(testUrl, {}).subscribe();

    const req = httpTestingController.expectOne(testUrl);

    expect(req.request.headers.get(headerName)).toBe(mockToken);
  });
});
