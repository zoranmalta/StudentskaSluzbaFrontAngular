import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExamTest } from '../model/examTest';

@Injectable({
  providedIn: 'root'
})
export class ExamTestsAndQuestionsService {

  private readonly examTestAndQuestionsURL=`${environment.apiBaseUri}/examtest/insert`
  private readonly examTestByExamIdURL=`${environment.apiBaseUri}/examtest/all`

  constructor(private http:HttpClient) { }

  insertTests(examTest:ExamTest):Observable<ExamTest>{
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ExamTest>(this.examTestAndQuestionsURL,examTest,{headers})
  }

  getExamTestsByExamId(examId:number):Observable<ExamTest[]>{
    return this.http.get<ExamTest[]>(`${this.examTestByExamIdURL}/${examId}`)
  }
}
