import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer } from '../model/answer';
import { ExamTest } from '../model/examTest';
import { Question } from '../model/question';
import { WorkTest } from '../model/workTest';

@Injectable({
  providedIn: 'root'
})
export class ExamTestsAndQuestionsService {

  private readonly examTestAndQuestionsURL=`${environment.apiBaseUri}/examtest/insert`
  private readonly examTestByExamIdURL=`${environment.apiBaseUri}/examtest/all`
  private readonly questionsByIdURL=`${environment.apiBaseUri}/examtest/questions`
  private readonly insertWorkTestURL=`${environment.apiBaseUri}/worktest/insert`
  private readonly getWorkTestByExamTestIdAndStudentId=`${environment.apiBaseUri}/worktest/one`
  private readonly getWorkTestsByExamTestURL=`${environment.apiBaseUri}/worktest/all`
  private readonly getAnswersByWorkTestURL=`${environment.apiBaseUri}/worktest/answer`

  constructor(private http:HttpClient) { }

  getAnswersByWorkTest(workTestId:number):Observable<Answer[]>{
    return this.http.get<Answer[]>(`${this.getAnswersByWorkTestURL}/${workTestId}`)
  }

  insertTests(examTest:ExamTest):Observable<ExamTest>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ExamTest>(this.examTestAndQuestionsURL,examTest,{headers})
  }

  insertWorkTest(workTest:WorkTest):Observable<WorkTest>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<WorkTest>(this.insertWorkTestURL,workTest,{headers})
  }

  getWorkTestByExamTestIdAndStudent(examTestId:number,studentId:number):Observable<WorkTest>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin':'*'});
    const params = new HttpParams().append('examTestId', examTestId.toString())
    .append('studentId',studentId.toString());
    return this.http.get<WorkTest>(`${this.getWorkTestByExamTestIdAndStudentId}`,{headers,params})
  }
  getWorkTestsByExamTest(examTestId:number):Observable<WorkTest[]>{
    return this.http.get<WorkTest[]>(`${this.getWorkTestsByExamTestURL}/${examTestId}`)
  }

  getExamTestsByExamId(examId:number):Observable<ExamTest[]>{
    return this.http.get<ExamTest[]>(`${this.examTestByExamIdURL}/${examId}`)
  }

  getQuestionsByExamTestAll(examTestId:number):Observable<Question[]>{
    return this.http.get<Question[]>(`${this.questionsByIdURL}/${examTestId}`)
  }

  getQuestionsByExamTestId(examTestId:number,page:number,size:number):Observable<Question[]>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin':'*'});
    const params = new HttpParams().append('examTestId', examTestId.toString())
    .append('page' , page.toString()).append('size',size.toString());

    return this.http.get<Question[]>(`${this.questionsByIdURL}`,{headers,params})
  }
}
