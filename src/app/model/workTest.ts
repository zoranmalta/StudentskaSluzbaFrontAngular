import { Answer } from './answer';
import { ExamTest } from './examTest';
import { Student } from './student';

export class WorkTest{
    id:number;
    student:Student
    examTest:ExamTest
    answers:Answer[]=[]
    bodovi:number
}