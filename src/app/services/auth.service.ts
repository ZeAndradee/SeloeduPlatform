import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, delay, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private router: Router,
    private userService: UserService,
    private emailService: EmailService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let storedUser = null;
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('currentUser');
      storedUser = stored ? JSON.parse(stored) : null;
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password?: string): Observable<boolean> {
    return this.userService.getUsers().pipe(
      delay(1000),
      map((users) => {
        const user = users.find((u) => u.email === email);
        if (user) {
          if (!user.password || user.password !== password) {
            return false;
          }

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const users = await this.userService.getUsers().pipe(take(1)).toPromise();
    const user = users?.find((u) => u.email === email);

    if (!user) {
      return false;
    }

    // GERA UM TOKEN ALEATORIO
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expires = Date.now() + 3600000; // 1 HORA

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.userService.updateUser(user.id, user).toPromise();

    const link = `${window.location.origin}/reset-password?token=${token}`;

    try {
      await this.emailService.sendVerificationEmail(email, link);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async verifyPasswordResetToken(token: string): Promise<boolean> {
    const users = await this.userService.getUsers().pipe(take(1)).toPromise();
    const user = users?.find(
      (u) =>
        u.resetPasswordToken === token && u.resetPasswordExpires! > Date.now()
    );
    return !!user;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const users = await this.userService.getUsers().pipe(take(1)).toPromise();
    const user = users?.find(
      (u) =>
        u.resetPasswordToken === token && u.resetPasswordExpires! > Date.now()
    );

    if (!user) {
      return false;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await this.userService.updateUser(user.id, user).toPromise();
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
