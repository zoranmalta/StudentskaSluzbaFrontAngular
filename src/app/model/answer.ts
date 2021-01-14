import { Question } from './question';
import { WorkTest } from './workTest';

export class Answer{
    id:number;
    workTest:WorkTest
    odgovor:string;
    tacan:boolean;
    question:Question
}