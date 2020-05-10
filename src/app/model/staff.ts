import { Academic } from './academic';
import { User } from './user';

export class Staff{
    id:number;
    deleted:boolean;
    firstName:string;
    lastName:string;
    academic:Academic;
    user:User
}