import { ExamTest } from './examTest';

export class Question{
    id:number;
    examTest:ExamTest;
    pitanje:string;
    odgovor1:string;
    odgovor2:string;
    odgovor3:string;
    odgovor4:string;
    opis:string;
    deleted:boolean;
}