import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Define interfaces for your request and response
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`, 
      loginRequest,
      { headers }
    ).pipe(
      tap(response => {
        // Store the token in localStorage or a service
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  // Optional: Add method to get the stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Optional: Add method to check if user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Optional: Add logout method
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}