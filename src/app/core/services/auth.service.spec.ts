import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockProviders } from 'ng-mocks';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionData } from 'src/app/shared/models/session-data.model';
import { UserData } from 'src/app/shared/models/user-data.model';
import MockDate from 'mockdate';
import { StorageKey } from 'src/app/shared/types/storage-key';

describe('AuthService', () => {
  let service: AuthService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const baseUrl = 'http://localhost:5000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ...MockProviders(
          StorageService,
          Router
        )
      ]
    });

    service = TestBed.inject(AuthService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("#loginWithEmailAndPassword()", () => {
    const mockEmail = 'johndoe@domain';
    const mockPassword = 'secretPassword';

    const mockSessionData: SessionData = {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@domain'
      } as UserData,
      expiresIn: 1000 * 2
    };

    it("should send POST request to /sessions with body", () => {
      service.loginWithEmailAndPassword(mockEmail, mockPassword).subscribe();

      const expectedUrl = `${baseUrl}/sessions`;
      const req = httpTestingController.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({
        email: mockEmail,
        password: mockPassword
      });

      req.flush(mockSessionData);
    });

    it("should call #storageService.storeSessionData() with sessionData as side effect", () => {
      const spy = spyOn(storageServiceSpy, 'storeSessionData');

      service
        .loginWithEmailAndPassword(mockEmail, mockPassword)
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith(mockSessionData);
        });

      const expectedUrl = `${baseUrl}/sessions`;
      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(mockSessionData);
    });

    it("should return TRUE when session data is save in storage", () => {
      spyOn(storageServiceSpy, 'hasInvalidSessionData').and.returnValue(false);

      service
        .loginWithEmailAndPassword(mockEmail, mockPassword)
        .subscribe((isLoggedIn: boolean) => {
          expect(isLoggedIn).toBeTrue();
        });

      const expectedUrl = `${baseUrl}/sessions`;
      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(mockSessionData);
    });
  });

  describe("#logout()", () => {
    it("should send DELETE request to /sessions", () => {
      service.logout().subscribe();

      const expectedUrl = `${baseUrl}/sessions`;
      const req = httpTestingController.expectOne(expectedUrl);

      expect(req.request.method).toEqual('DELETE');

      req.flush({});
    });

    it("should call #cleanSession()", () => {
      const spy = spyOn(service, 'cleanSession');

      service
        .logout()
        .subscribe(() => {
          expect(spy).toHaveBeenCalled();
        });

      const expectedUrl = `${baseUrl}/sessions`;
      const req = httpTestingController.expectOne(expectedUrl);
      req.flush({});
    });
  });

  describe("#refreshToken()", () => {
    const mockSessionData: SessionData = {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@domain'
      } as UserData,
      expiresIn: 1000 * 2
    };

    it("should send POST request to /sessions/refresh with empty body", () => {
      service.refreshToken().subscribe();

      const expectedUrl = `${baseUrl}/sessions/refresh`;
      const req = httpTestingController.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({});

      req.flush({});
    });

    it("should call #storageService.storeSessionData() with sessionData as side effect", () => {
      const spy = spyOn(storageServiceSpy, 'storeSessionData');

      service
        .refreshToken()
        .subscribe(() => {
          expect(spy).toHaveBeenCalledWith(mockSessionData);
        });

      const expectedUrl = `${baseUrl}/sessions/refresh`;
      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(mockSessionData);
    });
  });

  describe("#sendForgotPasswordEmail()", () => {
    const mockEmail = 'johndoe@domain';

    it("should send POST request to /forgotpassword with body", () => {
      const responseMsg = "Mock response message";

      service.sendForgotPasswordEmail(mockEmail)
        .subscribe((data) => {
          expect(data).toEqual(responseMsg);
        });

      const expectedUrl = `${baseUrl}/forgotpassword`;
      const req = httpTestingController.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ email: mockEmail });

      req.flush(responseMsg);
    });
  });

  describe("#resetPassword()", () => {
    const mockId = "1234567890";
    const mockResetCode = "12345";
    const mockPassword = "secret";

    it("should send POST request to /resetpassword/:id/:resetCode with body", () => {
      const responseMsg = "Mock response message";

      service.resetPassword(mockId, mockResetCode, mockPassword)
        .subscribe((data) => {
          expect(data).toEqual(responseMsg);
        });

      const expectedUrl = `${baseUrl}/resetpassword/${mockId}/${mockResetCode}`;
      const req = httpTestingController.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ password: mockPassword });

      req.flush(responseMsg);
    });
  });

  describe("#cleanSession()", () => {
    it("should call #storageService.deleteSessionData()", () => {
      const spy = spyOn(storageServiceSpy, 'deleteSessionData');

      service.cleanSession();

      expect(spy).toHaveBeenCalled();
    });

    it("should call #router and navigate to /auth", () => {
      const expectedPath = '/auth';
      const spy = spyOn(routerSpy, 'navigate');

      service.cleanSession();

      expect(spy).toHaveBeenCalledWith([expectedPath]);
    });
  });

  describe("#isLoggedIn()", () => {
    afterEach(() => {
      MockDate.reset();
    });

    it("should return TRUE when session data is saved in storage and expiration date has not arrived", () => {
      const mockCurrentDate = 1234567890;
      const expirationDate = mockCurrentDate + 1;

      MockDate.set(mockCurrentDate);

      spyOn(storageServiceSpy, 'hasInvalidSessionData').and.returnValue(false);
      spyOn(storageServiceSpy, 'getDataByKey')
        .withArgs('expires_at' as StorageKey).and.returnValue(expirationDate);

      const result = service.isLoggedIn();

      expect(result).toBeTrue();
    });

    it("should return FALSE when there is missing session data in storage", () => {
      const mockCurrentDate = 1234567890;
      const expirationDate = mockCurrentDate + 1;

      MockDate.set(mockCurrentDate);

      spyOn(storageServiceSpy, 'hasInvalidSessionData').and.returnValue(true);
      spyOn(storageServiceSpy, 'getDataByKey')
        .withArgs('expires_at' as StorageKey).and.returnValue(expirationDate);

      const result = service.isLoggedIn();

      expect(result).toBeFalse();
    });

    it("should return FALSE when expiration date has already arrived", () => {
      const mockCurrentDate = 1234567890;
      const expirationDate = mockCurrentDate - 1;

      MockDate.set(mockCurrentDate);

      spyOn(storageServiceSpy, 'hasInvalidSessionData').and.returnValue(false);
      spyOn(storageServiceSpy, 'getDataByKey')
        .withArgs('expires_at' as StorageKey).and.returnValue(expirationDate);

      const result = service.isLoggedIn();

      expect(result).toBeFalse();
    });
  });
});
