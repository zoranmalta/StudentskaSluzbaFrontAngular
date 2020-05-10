import { Course } from './course';
import { Staff } from './staff';

export class Engagement{
    id:number;
    deleted:boolean;
    course:Course;
    staff:Staff
}