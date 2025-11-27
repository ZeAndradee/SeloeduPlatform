export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'student';
  avatar?: string;
  enrolledCourseIds?: number[];
  classIds?: number[];
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  progress?: number; // ESTUDANTES
  studentsEnrolled?: number; // ADMINIS
  imageUrl?: string;
}
