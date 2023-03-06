import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Employee, Patient } from '../models/user';
import { AccountService } from '../services/account.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {

    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', Validators.required],
      firstLine: ['', Validators.required],
      secondLine: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
    });
    // redirect to home if already logged in
    if (this.accountService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  ngOnInit() { }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.register(this.getUser(this.form.value), this.form.value.type)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.alertService.success(data.message, { keepAfterRouteChange: true });
          this.router.navigate(['/login'], { relativeTo: this.route });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  getUser(value: any): any {
    if (value.type == "patient") {
      let patient: Patient = {
        name: value.name,
        email: value.email,
        password: value.password,
        mobileNumber: value.mobileNumber,
        address: [{
          firstLine: value.firstLine,
          secondLine: value.secondLine,
          city: value.city,
          state: value.state,
          country: value.country,
          zip: value.zip
        }]
      };
      return patient;
    } else if (value.type == "employee") {
      let employee: Employee = {
        name: value.name,
        email: value.email,
        password: value.password,
        mobileNumber: value.mobileNumber,
        address: {
          firstLine: value.firstLine,
          secondLine: value.secondLine,
          city: value.city,
          state: value.state,
          country: value.country,
          zip: value.zip
        }
      };
      return employee;
    }
  }


}
