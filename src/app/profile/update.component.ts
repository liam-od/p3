import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { MustMatch } from '../_helpers';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
  account = this.accountService.accountValue;
  form: FormGroup;
  loading = false;
  submitted = false;
  deleting = false;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        firstNames: [this.account.firstNames, Validators.required],
        lastName: [this.account.lastName, Validators.required],
        username: [this.account.username, Validators.required],
        email: [
          this.account.email,
          [Validators.required, Validators.pattern(this.emailPattern)]
        ],
        avatar: [this.account.avatar],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: ['']
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onStrengthChange(score) {
    console.log('new score', score);
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
      .update(this.account.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', {
            keepAfterRouteChange: true
          });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  onDelete() {
    if (confirm('Are you sure?')) {
      this.deleting = true;
      this.accountService
        .delete(this.account.id)
        .pipe(first())
        .subscribe(() => {
          this.alertService.success('Account deleted successfully', {
            keepAfterRouteChange: true
          });
        });
    }
  }
}
