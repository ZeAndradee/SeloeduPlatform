import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.authService.currentUserValue) {
      this.router.navigate([this.returnUrl]);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService
      .login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.error = 'Email ou senha inválidos.';
            this.loading = false;
          }
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }
}
