import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHome,
  heroBookOpen,
  heroUsers,
  heroCog6Tooth,
  heroArrowRightOnRectangle,
  heroAcademicCap,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      heroHome,
      heroBookOpen,
      heroUsers,
      heroCog6Tooth,
      heroArrowRightOnRectangle,
      heroAcademicCap,
    }),
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
