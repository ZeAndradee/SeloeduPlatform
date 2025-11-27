import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CourseService } from '../../../services/course.service';
import { User, Course } from '../../../models/user.model';
import { Observable, switchMap, of, forkJoin } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroCheck } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgIconComponent,
  ],
  viewProviders: [provideIcons({ heroArrowLeft, heroCheck })],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId?: number;
  courses$: Observable<Course[]>;
  selectedCourseIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      avatar: [''],
    });
    this.courses$ = this.courseService.getAllCourses();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = +id;

      // Password is not required when editing
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('password')?.updateValueAndValidity();

      this.loadStudent(this.studentId);
    }
  }

  loadStudent(id: number) {
    this.userService.getUser(id).subscribe((student) => {
      if (student) {
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          avatar: student.avatar,
        });
        this.selectedCourseIds = student.enrolledCourseIds || [];
      }
    });
  }

  toggleCourseSelection(courseId: number, event: any) {
    if (event.target.checked) {
      this.selectedCourseIds.push(courseId);
    } else {
      this.selectedCourseIds = this.selectedCourseIds.filter(
        (id) => id !== courseId
      );
    }
  }

  isCourseSelected(courseId: number): boolean {
    return this.selectedCourseIds.includes(courseId);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      const studentData: User = {
        ...formValue,
        role: 'student',
        enrolledCourseIds: this.selectedCourseIds,
      };

      if (this.isEditMode && this.studentId) {
        this.userService
          .updateUser(this.studentId, studentData)
          .subscribe(() => {
            this.router.navigate(['/students']);
          });
      } else {
        // ID is auto-incremented
        (
          this.userService.addUser(studentData as User) as Observable<any>
        ).subscribe({
          next: () => {
            this.router.navigate(['/students']);
          },
          error: (err) => {
            alert(err.message);
          },
        });
      }
    }
  }
}
