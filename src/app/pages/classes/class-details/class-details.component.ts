import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../../services/class.service';
import { Class } from '../../../models/class.model';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/user.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroTrash,
  heroUser,
  heroArrowLeft,
  heroChevronDown,
} from '@ng-icons/heroicons/outline';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIconComponent],
  viewProviders: [
    provideIcons({
      heroPlus,
      heroTrash,
      heroUser,
      heroArrowLeft,
      heroChevronDown,
    }),
  ],
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css'],
})
export class ClassDetailsComponent implements OnInit, OnDestroy {
  classItem!: Class;
  course!: Course;
  students: User[] = [];
  availableStudents: User[] = [];
  selectedStudentId: number | null = null;
  courseId!: number;
  classId!: number;
  private studentsSubscription?: Subscription;

  constructor(
    private classService: ClassService,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const courseId = params.get('courseId');
      const classId = params.get('classId');

      if (courseId && classId) {
        this.courseId = +courseId;
        this.classId = +classId;
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.studentsSubscription) {
      this.studentsSubscription.unsubscribe();
    }
  }

  loadData() {
    this.courseService.getCourse(this.courseId).subscribe((course) => {
      if (course) this.course = course;
    });

    this.classService.getClass(this.classId).subscribe((classItem) => {
      if (classItem) {
        this.classItem = classItem;
        this.loadStudents();
      }
    });
  }

  loadStudents() {
    if (this.studentsSubscription) {
      this.studentsSubscription.unsubscribe();
    }

    this.studentsSubscription = this.userService
      .getUsers()
      .subscribe((users) => {
        const allStudents = users.filter((u) => u.role === 'student');
        const enrolledIds = this.classItem.studentIds || [];

        this.students = allStudents.filter((s) => enrolledIds.includes(s.id));
        this.availableStudents = allStudents.filter(
          (s) => !enrolledIds.includes(s.id)
        );
      });
  }

  addStudent() {
    if (this.selectedStudentId) {
      this.classService
        .addStudentToClass(this.classId, +this.selectedStudentId)
        .then(() => {
          this.selectedStudentId = null;
          this.loadData();
        });
    }
  }

  removeStudent(studentId: number) {
    if (confirm('Remover aluno desta turma?')) {
      this.classService
        .removeStudentFromClass(this.classId, studentId)
        .then(() => {
          this.loadData();
        });
    }
  }
}
