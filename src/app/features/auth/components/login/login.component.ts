import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  private unsuscribe$: Subject<void> = new Subject<void>();

  public hidePassword: boolean = true;
  public loginForm!: FormGroup;

  public isLoading$: Observable<boolean> = new Observable();

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  public getEmailErrorMessage(): string {
    if (this.loginForm.hasError('required', 'email')) {
      return 'Email field is empty';
    }
    return this.loginForm.hasError('email', 'email') ? 'Email is invalid' : '';
  }
  public getPasswordErrorMessage(): string {
    if (this.loginForm.hasError('required', 'password')) {
      return 'Password field is empty';
    }
    return this.loginForm.hasError('minlength', 'password')
      ? 'Password is too short'
      : '';
  }

  public loginWithEmailAndPassword(): void {
    if (!this.loginForm.valid) {
      this.alertService.showError('Login form has invalid fields.');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.loginWithEmailAndPassword(email, password)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe({
        next: (isSuccessfullLogin: boolean) => {
          if (!isSuccessfullLogin) {
            this.alertService.showError('Login form has invalid fields.');
            return;
          }

          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.alertService.showError('Upss! Something went wrong.');
          console.error(err);
        }
      });
  }
}
