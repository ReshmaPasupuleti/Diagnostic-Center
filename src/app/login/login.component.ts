import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private accountService: AccountService
  ) {
    // redirect to home if already logged in
    if (this.accountService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      type: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f['email'].value, this.f['password'].value, this.f['type'].value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.data.length) {
            this.router.navigate(['/home']);
            this.alertService.success('Logged in Successfully');
          } else {
            this.alertService.error('User Not Found');
            this.loading = false;
          }
        },
        (error: any) => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
