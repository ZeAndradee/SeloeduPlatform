import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CourseListComponent } from './pages/courses/course-list/course-list.component';
import { CourseFormComponent } from './pages/courses/course-form/course-form.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/new', component: CourseFormComponent },
  { path: 'courses/edit/:id', component: CourseFormComponent },
  {
    path: 'students',
    loadComponent: () =>
      import('./pages/students/student-list/student-list.component').then(
        (m) => m.StudentListComponent
      ),
  },
  {
    path: 'students/new',
    loadComponent: () =>
      import('./pages/students/student-form/student-form.component').then(
        (m) => m.StudentFormComponent
      ),
  },
  {
    path: 'students/edit/:id',
    loadComponent: () =>
      import('./pages/students/student-form/student-form.component').then(
        (m) => m.StudentFormComponent
      ),
  },
  {
    path: 'classes',
    loadComponent: () =>
      import('./pages/classes/all-classes/all-classes.component').then(
        (m) => m.AllClassesComponent
      ),
  },
  {
    path: 'classes/new',
    loadComponent: () =>
      import('./pages/classes/class-form/class-form.component').then(
        (m) => m.ClassFormComponent
      ),
  },
  {
    path: 'classes/:classId/edit',
    loadComponent: () =>
      import('./pages/classes/class-form/class-form.component').then(
        (m) => m.ClassFormComponent
      ),
  },
  {
    path: 'courses/:courseId/classes',
    loadComponent: () =>
      import('./pages/classes/class-list/class-list.component').then(
        (m) => m.ClassListComponent
      ),
  },
  {
    path: 'courses/:courseId/classes/new',
    loadComponent: () =>
      import('./pages/classes/class-form/class-form.component').then(
        (m) => m.ClassFormComponent
      ),
  },
  {
    path: 'courses/:courseId/classes/:classId/edit',
    loadComponent: () =>
      import('./pages/classes/class-form/class-form.component').then(
        (m) => m.ClassFormComponent
      ),
  },
  {
    path: 'courses/:courseId/classes/:classId/students',
    loadComponent: () =>
      import('./pages/classes/class-details/class-details.component').then(
        (m) => m.ClassDetailsComponent
      ),
  },
  { path: '**', redirectTo: '/login' },
];
