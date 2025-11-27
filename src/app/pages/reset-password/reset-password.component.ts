import { Component, OnInit } from '@angular/core';
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
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  token = '';
  isValidToken = false;
  verifyingToken = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  async ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (this.token) {
      this.isValidToken = await this.authService.verifyPasswordResetToken(
        this.token
      );
    }
    this.verifyingToken = false;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  get f() {
    return this.resetForm.controls;
  }

  async onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const password = this.f['password'].value;
    const success = await this.authService.resetPassword(this.token, password);

    this.loading = false;

    if (success) {
      this.successMessage = 'Sua senha foi redefinida com sucesso!';
      this.resetForm.reset();
    } else {
      this.errorMessage =
        'Ocorreu um erro ao redefinir a senha. O token pode ter expirado.';
    }
  }
}
