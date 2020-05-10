import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Student } from '../model/student';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { StudentRowData } from '../model/studentRowData';
import { Payment } from '../model/payment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly findAllStudents = `${environment.apiBaseUri}/students/all`;
  private readonly findStudentByIdUrl = `${environment.apiBaseUri}/students`;
  private readonly findStudentByUserUrl=`${environment.apiBaseUri}/students/user`
  private readonly findStudentsAllReverse=`${environment.apiBaseUri}/students/allreverse`;
  private readonly insertStudentUrl = `${environment.apiBaseUri}/students/insert`;
  private readonly updateStudentUrl = `${environment.apiBaseUri}/students/update`;
  private readonly deleteStudentUrl = `${environment.apiBaseUri}/students/delete`

  private readonly getPaymentsUrl = `${environment.apiBaseUri}/payment/student`
  private readonly insertPaymentUrl= `${environment.apiBaseUri}/payment/insert`

  constructor(private http:HttpClient) { }

  getAllStudents():Observable<Student[]>{
    return this.http.get<Student[]>(this.findAllStudents)
  }

  getPayments(studentId:number):Observable<Payment[]>{
    return this.http.get<Payment[]>(`${this.getPaymentsUrl}/${studentId}`)
  }

  insertPayment(payment:Payment):Observable<Payment>{ 
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslan na server za insert payment :"+payment )
    return this.http.post<Payment>(this.insertPaymentUrl,payment,{headers})
  }

  getStudentById(studentId:number):Observable<Student>{
    return this.http.get<Student>(`${this.findStudentByIdUrl}/${studentId}`)
  }

  getStudentByUser(userId:number):Observable<Student>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<Student>(`${this.findStudentByUserUrl}/${userId}`,{headers})
  }

  insertStudentAndUser(studentRowData:any):Observable<Student>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslan na server za insert"+JSON.stringify(studentRowData) )
    return this.http.post<any>(this.insertStudentUrl,studentRowData,{headers})           
  }

  updateStudent(studentRowData:any):Observable<Student>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslan na server za update"+JSON.stringify(studentRowData) )
    return this.http.put<any>(this.updateStudentUrl,studentRowData,{headers})
  }

  deleteStudent(studentRowData:any):Observable<Student>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Objekat poslan na server za update"+studentRowData.id )
    return this.http.put<any>(this.deleteStudentUrl,studentRowData,{headers})
  }

  getStudentsNotEnrolledByCourseId(courseId:number):Observable<Student[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("Broj poslat na server sa adresom"+courseId);
    const studentsByCourseUrl=`${this.findStudentsAllReverse}/${courseId}`
    return this.http.get<Student[]>(studentsByCourseUrl,{headers});
  }

}
