import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';
import { ClassService } from '../../services/class.service';
import { User, Course } from '../../models/user.model';
import { Observable, switchMap, map } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBookOpen,
  heroUsers,
  heroStar,
  heroAcademicCap,
} from '@ng-icons/heroicons/outline';
import { CourseCardComponent } from '../../components/course-card/course-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, CourseCardComponent],
  viewProviders: [
    provideIcons({
      heroBookOpen,
      heroUsers,
      heroStar,
      heroAcademicCap,
    }),
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  courses$: Observable<Course[]>;
  studentCount$: Observable<number>;
  classCount$: Observable<number>;
  currentDate: Date = new Date();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private courseService: CourseService,
    private classService: ClassService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.courses$ = this.currentUser$.pipe(
      switchMap((user) => {
        if (user?.role === 'student') {
          return this.userService.getEnrolledCourses(user.id);
        }
        return this.courseService.getAllCourses();
      })
    );
    this.studentCount$ = this.userService.countStudents();
    this.classCount$ = this.classService
      .getClasses()
      .pipe(map((classes) => classes.length));
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
