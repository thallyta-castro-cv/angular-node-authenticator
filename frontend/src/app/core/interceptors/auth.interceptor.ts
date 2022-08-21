import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token');
      const authRequest = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
      return next.handle(authRequest)
        .pipe(catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.authService.logout();
              this.router.navigateByUrl('/auth/login');
            }
          }
          return throwError(() => error);
        }))
    }
    return next.handle(req);
  }
}
