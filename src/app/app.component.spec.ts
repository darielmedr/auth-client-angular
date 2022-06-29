import { MockProvider } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { EMPTY, of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        MockProvider(AuthService, {
          getXSRFToken: () => EMPTY,
        })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit("should call #authService.getXSRFToken() onInit to get XSRF token", () => {
    const spy = spyOn(authServiceSpy, 'getXSRFToken').and.returnValue(of(''));

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it("should call #authService.refreshToken() when user is logged in to init silent refresh", () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    authServiceSpy.refreshToken.and.returnValue(EMPTY);

    component.ngOnInit();

    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
  });
});
