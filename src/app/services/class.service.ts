import { Injectable } from '@angular/core';
import { db } from '../database/db';
import { Class } from '../models/class.model';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor() {}

  getClasses(): Observable<Class[]> {
    return from(db.classes.toArray());
  }

  getClassesByCourseId(courseId: number): Observable<Class[]> {
    return from(db.classes.where('courseId').equals(courseId).toArray());
  }

  getClass(id: number): Observable<Class | undefined> {
    return from(db.classes.get(id));
  }

  createClass(classData: Class): Observable<number> {
    return from(db.classes.add(classData));
  }

  updateClass(id: number, classData: Partial<Class>): Observable<number> {
    return from(db.classes.update(id, classData));
  }

  deleteClass(id: number): Observable<void> {
    return from(db.classes.delete(id));
  }

  async addStudentToClass(classId: number, studentId: number): Promise<void> {
    const classItem = await db.classes.get(classId);
    if (classItem) {
      const studentIds = classItem.studentIds || [];
      if (!studentIds.includes(studentId)) {
        studentIds.push(studentId);
        await db.classes.update(classId, { studentIds });
      }
    }

    const user = await db.users.get(studentId);
    if (user) {
      const classIds = user.classIds || [];
      if (!classIds.includes(classId)) {
        classIds.push(classId);
        await db.users.update(studentId, { classIds });
      }
    }
  }

  async removeStudentFromClass(
    classId: number,
    studentId: number
  ): Promise<void> {
    const classItem = await db.classes.get(classId);
    if (classItem && classItem.studentIds) {
      const studentIds = classItem.studentIds.filter((id) => id !== studentId);
      await db.classes.update(classId, { studentIds });
    }

    const user = await db.users.get(studentId);
    if (user && user.classIds) {
      const classIds = user.classIds.filter((id) => id !== classId);
      await db.users.update(studentId, { classIds });
    }
  }
}
