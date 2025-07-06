import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './sign-in.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatButtonModule,
    HttpClientModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn {
  constructor(
    private router: Router,
    private authService: AuthService // Inject the service
  ) {}

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      
      this.authService.login(email!, password!)
        .subscribe({
          next: (response) => {
            console.log('Login successful:', response);
            // Handle successful login (store token, redirect, etc.)
          },
          error: (err) => {
            console.error('Login failed:', err);
            // Handle error
          }
        });
    }
  }

  onSignUpPage() {
    this.router.navigate(['/sign-up']);
  }
}