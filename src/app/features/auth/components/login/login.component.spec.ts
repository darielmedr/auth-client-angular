import { MockProviders, MockModule } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { EMPTY, of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
      ],
      imports: [
        MockModule(MatCardModule),
        MockModule(MatFormFieldModule),
        MockModule(MatIconModule),
        MockModule(ReactiveFormsModule),
      ],
      providers: [
        FormBuilder,
        ...MockProviders(
          Router,
          AuthService,
          AlertService
        )
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should create an input element for each form control", () => {
    const loginFormElement = fixture.debugElement.query(By.css('#loginForm'));
    const inputElements = loginFormElement.queryAll(By.css('input'));

    const numberOfFormControls = 2;
    expect(inputElements.length).toBe(numberOfFormControls);
  });

  it("should create an input element for each form control", () => {
    const loginFormElement = fixture.debugElement.query(By.css('#loginForm'));
    const inputElements = loginFormElement.queryAll(By.css('input'));

    const numberOfFormControls = 2;
    expect(inputElements.length).toBe(numberOfFormControls);
  });

  it("should disable submit button when loginForm is invalid", () => {
    const submitBtnElement = fixture.debugElement.query(By.css('.btn-submit'));

    const invalidData = {
      email: "invalid email",
      password: "1234"
    };
    component.loginForm.patchValue(invalidData);
    fixture.detectChanges();

    const result = (submitBtnElement.nativeElement as HTMLButtonElement).disabled;

    expect(result).toBeTrue();
  });

  it("should call #loginWithEmailAndPassword() when 'ngSubmit' event is triggered", () => {
    const loginFormElement = fixture.debugElement.query(By.css('#loginForm'));

    const spy = spyOn(component, "loginWithEmailAndPassword");

    loginFormElement.triggerEventHandler('ngSubmit', null);

    expect(spy).toHaveBeenCalled();
  });

  describe('#loginWithEmailAndPassword()', () => {
    it('should call #alertService.showError() when loginForm is invalid', () => {
      const invalidData = {
        email: "invalid email",
        password: "1234"
      };
      component.loginForm.patchValue(invalidData);
      fixture.detectChanges();

      const expectedMessage = "Login form has invalid fields.";

      component.loginWithEmailAndPassword();

      expect(alertServiceSpy.showError).toHaveBeenCalledWith(expectedMessage);
    });

    describe("when loginForm is valid", () => {
      const validData = {
        email: "johndoe@domain",
        password: "validPassword"
      };

      beforeEach(() => {
        component.loginForm.patchValue(validData);
        fixture.detectChanges();
      });

      it('should call #authService.loginWithEmailAndPassword()', () => {
        authServiceSpy.loginWithEmailAndPassword.and.returnValue(EMPTY);

        component.loginWithEmailAndPassword();

        expect(authServiceSpy.loginWithEmailAndPassword).toHaveBeenCalledWith(validData.email, validData.password);
      });

      it("should navigate to '/dashboard' when #authService.loginWithEmailAndPassword() returns true.", () => {
        authServiceSpy.loginWithEmailAndPassword.and.returnValue(of(true));

        const expectedPath = '/dashboard';

        component.loginWithEmailAndPassword();

        expect(routerSpy.navigate).toHaveBeenCalledWith([expectedPath]);
      });

      it("should call #alertService.showError() when #authService.loginWithEmailAndPassword() returns false.", () => {
        authServiceSpy.loginWithEmailAndPassword.and.returnValue(of(false));

        const expectedMessage = "Login form has invalid fields.";

        component.loginWithEmailAndPassword();

        expect(alertServiceSpy.showError).toHaveBeenCalledWith(expectedMessage);
      });

      it("should call #alertService.showError() when #authService.loginWithEmailAndPassword() returns an error.", () => {
        authServiceSpy.loginWithEmailAndPassword.and
          .returnValue(throwError(() => "Some mock error message with login endpoint."));

        const expectedMessage = 'Upss! Something went wrong.';

        component.loginWithEmailAndPassword();

        expect(alertServiceSpy.showError).toHaveBeenCalledWith(expectedMessage);
      });
    });
  });
});
