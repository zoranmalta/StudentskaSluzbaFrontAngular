import { Student } from './student';
import { Exam } from './exam';

export class ExamRegistration{
    id:number;
    student:Student;
    exam:Exam;
    examApplication:Date;
    points:number;
    mark:number;
    pass:boolean;
    deleted:boolean
}