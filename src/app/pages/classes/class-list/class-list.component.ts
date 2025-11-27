import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../../services/class.service';
import { Class } from '../../../models/class.model';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/user.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroPencil,
  heroTrash,
  heroUsers,
  heroAcademicCap,
  heroCalendar,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, FormsModule],
  viewProviders: [
    provideIcons({
      heroPlus,
      heroPencil,
      heroTrash,
      heroUsers,
      heroAcademicCap,
      heroCalendar,
      heroMagnifyingGlass,
    }),
  ],
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css'],
})
export class ClassListComponent implements OnInit {
  classes: Class[] = [];
  allClasses: Class[] = [];
  searchTerm: string = '';
  courseId!: number;
  course?: Course;

  constructor(
    private classService: ClassService,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('courseId');
      if (id) {
        this.courseId = +id;
        this.loadCourse();
        this.loadClasses();
      }
    });
  }

  loadCourse() {
    this.courseService.getCourse(this.courseId).subscribe((course) => {
      if (course) {
        this.course = course;
      }
    });
  }

  loadClasses() {
    this.classService
      .getClassesByCourseId(this.courseId)
      .subscribe((classes) => {
        this.allClasses = classes;
        this.filterClasses();
      });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.filterClasses();
  }

  filterClasses() {
    if (!this.searchTerm) {
      this.classes = this.allClasses;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.classes = this.allClasses.filter((c) =>
      c.name.toLowerCase().includes(term)
    );
  }

  deleteClass(id: number) {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      this.classService.deleteClass(id).subscribe(() => {
        this.loadClasses();
      });
    }
  }
}
