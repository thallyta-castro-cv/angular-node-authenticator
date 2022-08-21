import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { User } from '../../interfaces/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public states = ["MG", "RS", "SC", "GO", "PR", "SP"];
  public formRegister: FormGroup;

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
    this.formRegister = this.formBuilder.group({
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'address': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
      'mobilephone': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'password1': ['', [Validators.required, Validators.minLength(6)]],
      'password2': ['', [Validators.required, Validators.minLength(6)]],
    }, {validator: this.matchingPasswords});
  }

  public onSubmit() {
    let user: User = {
      ...this.formRegister.value,
      password: this.formRegister.value.password1
    };

    this.authService.register(user)
      .pipe(takeUntil(this.unsubscribeNotifier))
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Successfuly registered. Use your credentials to sing in',
            'OK', {duration: 2000});
            this.router.navigateByUrl('/auth/login');
        },
        error:
        (error) => {
          this.snackBar.open(error.error.message,'OK', {duration: 2000});
      }
    })
  }

  public matchingPasswords(group: FormGroup) {
    if (group) {
      const password1 = group.controls['password1'].value;
      const password2 = group.controls['password2'].value;
      if (password1 == password2) {
        return null;
      }
    }
    return {matching: false};
  }
}
