import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../../services/class.service';
import { Class } from '../../../models/class.model';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/user.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPencil,
  heroTrash,
  heroUsers,
  heroPlus,
  heroAcademicCap,
  heroCalendar,
  heroMagnifyingGlass,
} from '@ng-icons/heroicons/outline';
import { forkJoin, map, take } from 'rxjs';

@Component({
  selector: 'app-all-classes',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, FormsModule],
  viewProviders: [
    provideIcons({
      heroPencil,
      heroTrash,
      heroUsers,
      heroPlus,
      heroAcademicCap,
      heroCalendar,
      heroMagnifyingGlass,
    }),
  ],
  templateUrl: './all-classes.component.html',
  styleUrls: ['./all-classes.component.css'],
})
export class AllClassesComponent implements OnInit {
  classes: (Class & { courseName?: string })[] = [];
  allClasses: (Class & { courseName?: string })[] = [];
  searchTerm: string = '';

  constructor(
    private classService: ClassService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses() {
    forkJoin({
      classes: this.classService.getClasses(),
      courses: this.courseService.getAllCourses().pipe(take(1)),
    }).subscribe(({ classes, courses }) => {
      this.allClasses = classes.map((c) => ({
        ...c,
        courseName:
          courses.find((course: Course) => course.id === c.courseId)?.title ||
          'Desconhecido',
      }));
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
    this.classes = this.allClasses.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.courseName && c.courseName.toLowerCase().includes(term))
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
