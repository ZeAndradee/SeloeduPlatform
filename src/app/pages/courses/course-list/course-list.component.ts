import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/user.model';
import { Observable } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPencilSquare,
  heroTrash,
  heroPlus,
  heroBookOpen,
  heroUser,
  heroUsers,
} from '@ng-icons/heroicons/outline';
import { CourseCardComponent } from '../../../components/course-card/course-card.component';

import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, CourseCardComponent],
  viewProviders: [
    provideIcons({
      heroPencilSquare,
      heroTrash,
      heroPlus,
      heroBookOpen,
      heroUser,
      heroUsers,
    }),
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent implements OnInit {
  courses$: Observable<Course[]>;
  currentUser$: Observable<User | null>;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.courses$ = this.courseService.getAllCourses();
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe();
    }
  }
}
