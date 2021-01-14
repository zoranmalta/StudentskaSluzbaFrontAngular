import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { ExamTest } from 'src/app/model/examTest';
import { WorkTest } from 'src/app/model/workTest';
import { ExamTestsAndQuestionsService } from 'src/app/services/exam-tests-and-questions.service';

@Component({
  selector: 'app-prof-test-details',
  templateUrl: './prof-test-details.component.html',
  styleUrls: ['./prof-test-details.component.css']
})
export class ProfTestDetailsComponent implements OnInit {

  examTest:ExamTest
  infinite:Observable<WorkTest[]>

  constructor(private router:Router,private examTestService:ExamTestsAndQuestionsService
    ,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
       //primamo ceo objekat Exam preko brauzera history.state.data(ime objekta data)
   this.examTest=window.history.state.data
   if(this.examTest===undefined||this.examTest===null){
     this.router.navigate(["/home"])
   }
   this.examTestService.getWorkTestsByExamTest(this.examTest.id).subscribe(
     data=>this.infinite=from([data])
   )
  }

  detaljiTesta(workTest:WorkTest){
    this.router.navigate(['/teststudent'],{state:{data:workTest}})
  }

  nazad(examTest:ExamTest){
    this.router.navigate(["/profexamdetails"],{state:{data:examTest.exam}})
  }

  trackByIdx(i){
    return i;
  }

}
