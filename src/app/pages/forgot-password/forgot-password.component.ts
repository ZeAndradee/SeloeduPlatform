import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  async onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.f['email'].value;
    const success = await this.authService.sendPasswordResetEmail(email);

    this.loading = false;

    if (success) {
      this.successMessage =
        'Um link para redefinir sua senha foi enviado para o seu email.';
      this.forgotForm.reset();
      this.forgotForm.reset();
    } else {
      this.errorMessage =
        'Ocorreu um erro ao tentar enviar o email. Tente novamente.';
    }
  }
}
