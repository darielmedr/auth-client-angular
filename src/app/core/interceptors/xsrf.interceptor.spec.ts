import { TestBed } from '@angular/core/testing';

import { XsrfInterceptor } from './xsrf.interceptor';

xdescribe('XsrfInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      XsrfInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: XsrfInterceptor = TestBed.inject(XsrfInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
