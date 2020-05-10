import { Student } from './student';

export class Payment{
    id:number;
    reason:string;
    onePaymentChange:number;
    paymentTime:Date;
    student:Student
}