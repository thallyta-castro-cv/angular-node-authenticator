import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { finalize, Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup;
  public loading: boolean = false;
  private unsubscribeNotifier = new Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createform();
  }

  ngOndestroy(): void {
    this.unsubscribeNotifier.next();
    this.unsubscribeNotifier.complete();
  }

  public createform(): void {
    this.formLogin = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit() {
    const crendentials = this.formLogin.value;
    this.loading = true;

    this.authService.login(crendentials)
      .pipe(
        takeUntil(this.unsubscribeNotifier),
        finalize(() => (this.loading = false)))
      .subscribe({
        next: (user) => {
          this.snackBar.open(
            'Logged in successfuly. Welcome ' + user.firstname + '!', 'OK',
            { duration: 2000 });
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.snackBar.open(
            'Login Error', 'OK', { duration: 2000 });
        }
      })
    }

}
