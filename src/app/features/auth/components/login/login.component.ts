import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public hidePassword: boolean = true;
  public loginForm!: FormGroup;

  public isLoading$: Observable<boolean> = new Observable();

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
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
    console.log('Login with email and password');
  }
}
