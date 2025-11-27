import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/user.model';
import { CourseCardComponent } from '../../../components/course-card/course-card.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroExclamationCircle,
  heroCheck,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgIconComponent,
    CourseCardComponent,
  ],
  viewProviders: [
    provideIcons({ heroArrowLeft, heroExclamationCircle, heroCheck }),
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css',
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId?: number;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      this.loadCourse(this.courseId);
    }
  }

  loadCourse(id: number) {
    this.courseService.getCourse(id).subscribe((course) => {
      if (course) {
        this.courseForm.patchValue(course);
      }
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;

      if (this.isEditMode && this.courseId) {
        this.courseService
          .updateCourse(this.courseId, { ...courseData, id: this.courseId })
          .subscribe(() => {
            this.router.navigate(['/courses']);
          });
      } else {
        this.courseService
          .addCourse({ ...courseData, studentsEnrolled: 0, progress: 0 })
          .subscribe(() => {
            this.router.navigate(['/courses']);
          });
      }
    }
  }
  get previewCourse(): Course {
    const formValue = this.courseForm.value;
    return {
      id: this.courseId || 0,
      title: formValue.title,
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      studentsEnrolled: 0,
      progress: 0,
    };
  }
}
