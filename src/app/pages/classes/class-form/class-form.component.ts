import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassService } from '../../../services/class.service';
import { Class } from '../../../models/class.model';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/user.model';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCheck,
  heroChevronDown,
  heroArrowLeft,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgIconComponent],
  viewProviders: [provideIcons({ heroCheck, heroChevronDown, heroArrowLeft })],
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css'],
})
export class ClassFormComponent implements OnInit {
  classForm: FormGroup;
  courseId!: number;
  classId?: number;
  isEditMode = false;
  course!: Course;
  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      courseId: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const classId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      this.courseId = +courseId;
      this.loadCourse();
    } else {
      this.loadCourses();
    }

    if (classId) {
      this.classId = +classId;
      this.isEditMode = true;
      this.loadClass();
    }
  }

  loadCourse() {
    this.courseService.getCourse(this.courseId).subscribe((course) => {
      if (course) {
        this.course = course;
        this.classForm.patchValue({ courseId: course.id });
      }
    });
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

  loadClass() {
    if (this.classId) {
      this.classService.getClass(this.classId).subscribe((classItem) => {
        if (classItem) {
          this.classForm.patchValue({
            name: classItem.name,
            courseId: classItem.courseId,
            startDate: classItem.startDate
              ? new Date(classItem.startDate).toISOString().split('T')[0]
              : '',
            endDate: classItem.endDate
              ? new Date(classItem.endDate).toISOString().split('T')[0]
              : '',
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.classForm.valid) {
      const formValue = this.classForm.value;
      const classData: Class = {
        id: this.classId,
        courseId: this.courseId || +formValue.courseId,
        name: formValue.name,
        startDate: formValue.startDate
          ? new Date(formValue.startDate)
          : undefined,
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
        studentIds: [], // Preserve existing students if editing? Need to handle this.
      };

      if (this.isEditMode && this.classId) {
        // We need to preserve studentIds when updating
        this.classService.getClass(this.classId).subscribe((existingClass) => {
          if (existingClass) {
            classData.studentIds = existingClass.studentIds;
            this.classService
              .updateClass(this.classId!, classData)
              .subscribe(() => {
                if (this.courseId) {
                  this.router.navigate(['/courses', this.courseId, 'classes']);
                } else {
                  this.router.navigate(['/classes']);
                }
              });
          }
        });
      } else {
        this.classService.createClass(classData).subscribe(() => {
          if (this.courseId) {
            this.router.navigate(['/courses', this.courseId, 'classes']);
          } else {
            this.router.navigate(['/classes']);
          }
        });
      }
    }
  }
}
