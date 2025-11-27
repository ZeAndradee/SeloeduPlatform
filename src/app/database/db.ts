import Dexie, { Table } from 'dexie';
import { User, Course } from '../models/user.model';
import { Class } from '../models/class.model';
import usersData from './users.json';
import coursesData from './courses.json';

export class AppDatabase extends Dexie {
  users!: Table<User, number>;
  courses!: Table<Course, number>;
  classes!: Table<Class, number>;

  constructor() {
    super('SeloeduDatabase');
    this.version(3).stores({
      users: '++id, email, *enrolledCourseIds, *classIds',
      courses: '++id, title',
      classes: '++id, courseId, *studentIds',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await this.users.bulkAdd(usersData as User[]);
    await this.courses.bulkAdd(coursesData as Course[]);
  }
}

export const db = new AppDatabase();
