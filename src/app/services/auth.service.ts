import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://test-demo.aemenersol.com/api/account/login';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, {
      username,
      password
    }, {
      responseType: 'text' as 'json'
    });
  }

  saveToken(token: string): void {
    const cleanToken = String(token)
      .replace(/^['"]+|['"]+$/g, '')
      .trim();

    localStorage.setItem('token', cleanToken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isLocalSession = this.isLocalSession();

    return (!!token && token.trim().length > 0) || isLocalSession;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('localSession');
  }

  saveLocalSession(): void {
    localStorage.setItem('localSession', 'true');
  }

  isLocalSession(): boolean {
    return localStorage.getItem('localSession') === 'true';
  }
}