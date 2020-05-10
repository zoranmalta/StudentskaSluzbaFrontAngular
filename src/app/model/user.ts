import { Authority } from './authority';

export class User {
    public id:number
    public username:string
    public password:string
    public deleted:boolean
    public authorities:Authority[]

     //automatski stvara polja za atribute i dodeljuje im vrednosti kroz konstruktor
     constructor(){}
    
}
