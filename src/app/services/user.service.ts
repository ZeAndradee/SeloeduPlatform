import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { db } from '../database/db';
import { User } from '../models/user.model';
import { liveQuery } from 'dexie';
import { from, of, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getUsers() {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return from(liveQuery(() => db.users.toArray()));
  }

  getUser(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(db.users.get(id));
  }

  addUser(user: User) {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(
      db.users
        .where('email')
        .equals(user.email)
        .first()
        .then((existingUser) => {
          if (existingUser) {
            throw new Error('Já existe um usuário com este e-mail.');
          }
          return db.users.add(user);
        })
    );
  }

  updateUser(id: number, user: User) {
    if (!isPlatformBrowser(this.platformId)) {
      return of(0);
    }
    return from(db.users.update(id, user as any));
  }

  deleteUser(id: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return of();
    }
    return from(db.users.delete(id));
  }

  enrollUser(userId: number, courseId: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(
      db.users
        .where('id')
        .equals(userId)
        .modify((user) => {
          if (!user.enrolledCourseIds) {
            user.enrolledCourseIds = [];
          }
          if (!user.enrolledCourseIds.includes(courseId)) {
            user.enrolledCourseIds.push(courseId);
          }
        })
    );
  }

  unenrollUser(userId: number, courseId: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return from(
      db.users
        .where('id')
        .equals(userId)
        .modify((user) => {
          if (user.enrolledCourseIds) {
            user.enrolledCourseIds = user.enrolledCourseIds.filter(
              (id) => id !== courseId
            );
          }
        })
    );
  }

  getEnrolledCourses(userId: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return from(
      db.users.get(userId).then((user) => {
        if (user && user.enrolledCourseIds) {
          return db.courses.where('id').anyOf(user.enrolledCourseIds).toArray();
        }
        return [];
      })
    );
  }

  countStudentsInCourse(courseId: number): Observable<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(0);
    }
    return from(
      liveQuery(() =>
        db.users.where('enrolledCourseIds').equals(courseId).count()
      )
    );
  }

  countStudents(): Observable<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(0);
    }
    return from(
      liveQuery(() => db.users.where('role').equals('student').count())
    );
  }
}
