import { MockProvider } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { EMPTY } from 'rxjs';

describe('DashboardComponent', () => {
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
        MockProvider(AuthService)
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

  it("should call #authService.refreshToken() when user is logged in to init silent refresh", () => {
    spyOn(authServiceSpy, 'isLoggedIn').and.returnValue(true);

    const spy = spyOn(authServiceSpy, 'refreshToken').and.returnValue(EMPTY);

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });
});
