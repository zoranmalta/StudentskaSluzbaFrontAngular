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
    bodovi:number=0;
    deleted:boolean;

    prikaziOpis:boolean;
    izabran:boolean;

    prikaz1:string;
    prikaz2:string;
    prikaz3:string;
    prikaz4:string;
    
    datTacanOdgovor1:boolean;
    datNetacanOdgovor1:boolean;

    datTacanOdgovor2:boolean;
    datNetacanOdgovor2:boolean;

    datTacanOdgovor3:boolean;
    datNetacanOdgovor3:boolean;

    datTacanOdgovor4:boolean;
    datNetacanOdgovor4:boolean;
}