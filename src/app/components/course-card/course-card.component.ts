import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBookOpen, heroUser, heroUsers } from '@ng-icons/heroicons/outline';
import { Course, User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  viewProviders: [provideIcons({ heroBookOpen, heroUser, heroUsers })],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent implements OnInit {
  @Input() course!: Course;
  @Input() user: User | null = null;
  @Input() userRole: 'admin' | 'student' = 'student';
  @Input() isPreview = false;

  studentCount$: Observable<number> = of(0);

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.userRole === 'admin' && this.course?.id) {
      this.studentCount$ = this.userService.countStudentsInCourse(
        this.course.id
      );
    }
  }

  get isEnrolled(): boolean {
    return (
      this.user?.role === 'student' &&
      !!this.user?.enrolledCourseIds?.includes(this.course.id)
    );
  }
}
