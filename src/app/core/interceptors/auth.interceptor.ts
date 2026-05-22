import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const cleanToken = token
        .replace(/^['"]+|['"]+$/g, '')
        .trim();

      const authHeader = cleanToken.startsWith('Bearer ')
        ? cleanToken
        : `Bearer ${cleanToken}`;

      const authRequest = request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });

      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}