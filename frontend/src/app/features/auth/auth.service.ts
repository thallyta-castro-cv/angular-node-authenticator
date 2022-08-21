import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly path = 'http://localhost:3000/auth';

  private subjUser$: BehaviorSubject<User> = new BehaviorSubject(null);
  private subjLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.path}/register`, user);
  }

  login(credentials: {email: string, password: string}): Observable<User> {
    return this.http
      .post<User>(`${this.path}/login`, credentials)
      .pipe(
        tap((user: User) => {
          localStorage.setItem('token', user.token);
          this.subjLoggedIn$.next(true);
          this.subjUser$.next(user);
        })
      )
  }

  getUser(): Observable<User> {
    return this.subjUser$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token && !this.subjLoggedIn$.value) {
      return this.checkTokenValidation();
    }
    return this.subjLoggedIn$.asObservable();
  }

  checkTokenValidation(): Observable<boolean> {
    return this.http
      .get<User>(`${this.path}/user`)
      .pipe(
        tap((user: User) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.subjLoggedIn$.next(true);
            this.subjUser$.next(user);
          }
        }),
        map((user: User) => (user)?true:false),
        catchError((error) => {
          this.logout();
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.subjLoggedIn$.next(false);
    this.subjUser$.next(null);
  }
}
