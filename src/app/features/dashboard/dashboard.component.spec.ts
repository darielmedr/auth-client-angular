import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule, MockProviders } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [
        ...MockProviders(
          BreakpointObserver,
          AuthService
        )
      ],
      imports: [
        RouterTestingModule,
        MockModule(MaterialModule)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    breakpointObserverSpy.observe.and.returnValue(EMPTY);
    authServiceSpy.logout.and.returnValue(EMPTY);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #authService.logout() when click on logout', () => {
    const logoutElement = fixture.debugElement.query(By.css('.logout'));

    (logoutElement.nativeElement as HTMLAnchorElement).click();
    fixture.detectChanges();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
