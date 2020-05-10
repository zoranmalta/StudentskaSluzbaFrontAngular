import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../model/exam';
import { ExamRegistration } from '../model/examRegistration';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private readonly getExamsUrl=`${environment.apiBaseUri}/exams/all`
  private readonly getExamsForStaffUrl=`${environment.apiBaseUri}/exams/staff`
  private readonly getExamsNotRegistrationUrl=`${environment.apiBaseUri}/exams/allnotregistration`
  private readonly insertExamUrl=`${environment.apiBaseUri}/exams/insert`
  private readonly updateExamUrl=`${environment.apiBaseUri}/exams/update`
  private readonly archiveExamUrl=`${environment.apiBaseUri}/exams/archive`

  private readonly insertExamRegistrationUrl=`${environment.apiBaseUri}/examregistration/insert`
  private readonly deleteExamRegistrationUrl=`${environment.apiBaseUri}/examregistration/delete`
  private readonly getExamRegistrationForExamUrl=`${environment.apiBaseUri}/examregistration/exam`
  private readonly getFinishecExamRegistrationsUrl=`${environment.apiBaseUri}/examregistration/student`
  private readonly finishExamRegistrationUrl=`${environment.apiBaseUri}/examregistration/updatefinish`

  constructor(private http:HttpClient,private snackBar:MatSnackBar) { }

  getExamRegistrationsForExam(examId:number):Observable<ExamRegistration[]>{
    return this.http.get<ExamRegistration[]>(`${this.getExamRegistrationForExamUrl}/${examId}`)
  }

  getFinishedExamRegistrations(studentId:number):Observable<ExamRegistration[]>{
    return this.http.get<ExamRegistration[]>(`${this.getFinishecExamRegistrationsUrl}/${studentId}`)
  }

  getExams():Observable<Exam[]>{
    // let time = new Date("2020-06-30T10:00:01.000Z");
    // alert(time.getTime);
    return this.http.get<Exam[]>(this.getExamsUrl)
  }
  getExamsForStaff(staffId:number):Observable<Exam[]>{
    return this.http.get<Exam[]>(`${this.getExamsForStaffUrl}/${staffId}`)
  }

  getExamsForStudent(studentId:number):Observable<Exam[]>{
    return this.http.get<Exam[]>(`${this.getExamsUrl}/${studentId}`)
  }

  getExamsForStudentNotRegistration(studentId:number):Observable<Exam[]>{
    return this.http.get<Exam[]>(`${this.getExamsNotRegistrationUrl}/${studentId}`)
  }

  archiveExam(exam:Exam):Observable<Exam>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za archive : "+exam )
    return this.http.put<Exam>(this.archiveExamUrl,exam,{headers})
  }

  updateExam(exam:Exam):Observable<Exam>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za insert : "+exam )
    return this.http.put<Exam>(this.updateExamUrl,exam,{headers})
  }

  insertExam(exam:Exam):Observable<Exam>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za insert : "+exam )
    return this.http.post<Exam>(this.insertExamUrl,exam,{headers}).pipe(tap(
      () => {},
      (err: any) => {
        if(err.status===406){
          this.snackBar.open(`Ispit  vec postoji`,"",{duration:2500})
      }
      }
    ))
  }

  insertExamRegistration(examRegistration:ExamRegistration):Observable<ExamRegistration>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za insert : "+examRegistration )
    return this.http.post<ExamRegistration>(this.insertExamRegistrationUrl,examRegistration,{headers})
  }

  deleteExamRegistration(examRegistration:ExamRegistration):Observable<ExamRegistration>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za delete : "+examRegistration )
    return this.http.put<ExamRegistration>(this.deleteExamRegistrationUrl,examRegistration,{headers})
  }
  finishExamRegistration(examRegistration:ExamRegistration):Observable<ExamRegistration>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslat na server za finish : "+examRegistration )
    return this.http.put<ExamRegistration>(this.finishExamRegistrationUrl,examRegistration,{headers})
  }

}
