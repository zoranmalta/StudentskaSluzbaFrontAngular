import { Course } from './course';

export class Exam{
    id:number;
    course:Course;
    period:string;
    examStart:Date;
    archived:boolean
}