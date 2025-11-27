import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { db } from '../database/db';
import { Course } from '../models/user.model';
import { liveQuery } from 'dexie';
import { from, of, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getAllCourses(): Observable<Course[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return from(liveQuery(() => db.courses.toArray()));
  }

  getCourse(id: number): Observable<Course | undefined> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(db.courses.get(id));
  }

  addCourse(course: Omit<Course, 'id'>): Observable<number | undefined> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(db.courses.add(course as Course));
  }

  updateCourse(id: number, course: Course): Observable<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(0);
    }
    return from(db.courses.update(id, course));
  }

  deleteCourse(id: number): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(db.courses.delete(id));
  }
}
