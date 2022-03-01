import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../services/auth.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(AuthService)
      ]
    });
    guard = TestBed.inject(AuthGuard);

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe("#canActivate()", () => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockStateRoute = {} as RouterStateSnapshot;

    it("should return TRUE when user is logged in", () => {
      authServiceSpy.isLoggedIn.and.returnValue(true);

      const result = guard.canActivate(mockRoute, mockStateRoute);

      expect(result).toBeTrue();
    });

    it("should return FALSE when user is NOT logged in and call #authService.cleanSession()", () => {
      authServiceSpy.isLoggedIn.and.returnValue(false);

      const result = guard.canActivate(mockRoute, mockStateRoute);

      expect(result).toBeFalse();
      expect(authServiceSpy.cleanSession).toHaveBeenCalled();
    });
  });
});
