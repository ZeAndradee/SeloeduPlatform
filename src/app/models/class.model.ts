export interface Class {
  id?: number;
  name: string;
  courseId: number;
  startDate?: Date;
  endDate?: Date;
  studentIds?: number[];
}
