import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { MustMatch } from '../_helpers';
import * as SparkMD5 from 'spark-md5';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  public hash: string;
  public avatar: string;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.hash = SparkMD5.hash('defalut');
    this.createIdenticon(this.hash);
  }

  ngAfterViewInit() {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        firstNames: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.pattern(this.emailPattern)]
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        avatar: [this.avatar]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  onStrengthChange(score) {
    console.log('new score', score);
  }

  onFocusOut(event: any) {
    const email: string = event.target.value;
    if (email) {
      // Get the textbox value
      this.hash = SparkMD5.hash(email); // Generate hash value
      this.createIdenticon(this.hash); // Create identicons
      this.ngAfterViewInit();
      this.f['avatar'].setValue(this.avatar);
    }
  }

  createIdenticon(emailHash: string) {
    this.avatar =
      'https://www.gravatar.com/avatar/' + emailHash + '?d=identicon'; // request gravatar to generate identicons
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService
      .register(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success(
            'Registration successful, please check your email for verification instructions',
            { keepAfterRouteChange: true }
          );
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
