import { Student } from './student';
import { Course } from './course';

export class Enrollment{
    id:number;
    deleted:boolean;
    student:Student;
    course:Course;
}