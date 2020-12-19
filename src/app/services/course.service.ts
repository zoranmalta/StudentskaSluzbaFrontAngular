import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../model/course';
import { Enrollment } from '../model/enrollment';
import { Engagement } from '../model/engagement';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private readonly getCoursesUrl=`${environment.apiBaseUri}/courses/all`
  private readonly insertCourseUrl=`${environment.apiBaseUri}/courses/insert`
  private readonly updateCourseUrl=`${environment.apiBaseUri}/courses/update`
  private readonly deleteCourseUrl=`${environment.apiBaseUri}/courses/delete`

  private readonly getEnrollmentByCourseId=`${environment.apiBaseUri}/enrollments/course`
  private readonly deleteEnrollmentsByListUrl=`${environment.apiBaseUri}/enrollments/delete`
  private readonly insertEnrollmentsByListUrl=`${environment.apiBaseUri}/enrollments/insert`

  private readonly getEngagementByCourseIdUrl=`${environment.apiBaseUri}/engagements/course`
  private readonly deleteEngagementByListUrl=`${environment.apiBaseUri}/engagements/delete`
  private readonly insertEngagementsByListUrl=`${environment.apiBaseUri}/engagements/insert`

  constructor( private http:HttpClient) { }

  getCourses():Observable<Course[]>{
    return this.http.get<Course[]>(this.getCoursesUrl);
  }

  getCoursesByStudentId(studentId:number):Observable<Course[]>{
    return this.http.get<Course[]>(`${this.getCoursesUrl}/${studentId}`)
  }

  insertCourse(course:Course):Observable<Course>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za insert : "+course )
    return this.http.post<Course>(this.insertCourseUrl,course,{headers})
  }

  updateCourse(course:Course):Observable<Course>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za update : "+course )
    return this.http.put<Course>(this.updateCourseUrl,course,{headers})
  }

  deleteCourse(course:Course):Observable<Course>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za delete : "+course )
    return this.http.put<Course>(this.deleteCourseUrl,course,{headers})
  }

  getEnrollmentsByCourseId(courseId:number):Observable<Enrollment[]>{
    return this.http.get<Enrollment[]>(`${this.getEnrollmentByCourseId}/${courseId}`)
  }
  getEngagementByCourseId(courseId:number):Observable<Engagement[]>{
    return this.http.get<Engagement[]>(`${this.getEngagementByCourseIdUrl}/${courseId}`)
  }

  deleteEnrollmentsByList(list:Enrollment[]):Observable<Enrollment[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za update"+list )
    return this.http.put<Enrollment[]>(this.deleteEnrollmentsByListUrl,list,{headers})
  }
  deleteEngagementsByList(list:Engagement[]):Observable<Engagement[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Engagement list poslat na server za delete :"+list )
    return this.http.put<Engagement[]>(this.deleteEngagementByListUrl,list,{})
  }

  insertEnrollments(list:Enrollment[]):Observable<Enrollment[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za insert : "+list )
    return this.http.post<Enrollment[]>(this.insertEnrollmentsByListUrl,list,{headers})
  }
  insertEngagements(list:Engagement[]):Observable<Engagement[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za insert : "+list )
    return this.http.post<Engagement[]>(this.insertEngagementsByListUrl,list,{headers})
  }

}
