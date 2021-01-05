import { Course } from './course';
import { ExamTest } from './examTest';

export class Exam{
    id:number;
    course:Course;
    period:string;
    examStart:Date;
    archived:boolean
    examTestList:ExamTest[]=[]
}