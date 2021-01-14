import { Exam } from './exam';
import { Question } from './question';

export class ExamTest{
    id:number;
    exam:Exam;
    trajanje:number;
    bodovi:number=0;
    tema:string;
    testStart:Date;
    deleted:boolean;
    zavrseno:boolean;
    dostupno:boolean;
    questions:Question[]=[]
}