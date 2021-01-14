import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Answer } from 'src/app/model/answer';
import { ExamTest } from 'src/app/model/examTest';
import { Question } from 'src/app/model/question';
import { WorkTest } from 'src/app/model/workTest';
import { ExamTestsAndQuestionsService } from 'src/app/services/exam-tests-and-questions.service';

@Component({
  selector: 'app-test-student',
  templateUrl: './test-student.component.html',
  styleUrls: ['./test-student.component.css']
})
export class TestStudentComponent implements OnInit {

  workTest:WorkTest
  answers:Answer[]=[]
  questions:Question[]=[]
  infinite:Observable<Answer[]>
  constructor(private router:Router,private examTestAndQuestionsService:ExamTestsAndQuestionsService) { }

  ngOnInit(): void {
    this.workTest=window.history.state.data
    if(this.workTest===undefined||this.workTest===null){
      this.router.navigate(["/home"])
    }

    this.examTestAndQuestionsService.getAnswersByWorkTest(this.workTest.id).subscribe(
      data=>{
        this.answers=data
        this.examTestAndQuestionsService.getQuestionsByExamTestAll(this.workTest.examTest.id).subscribe(
          data=>{
            this.questions=data
            for (let index = 0; index < this.answers.length; index++) {
             this.answers[index].question=this.questions[index]
            }
            this.infinite=from([this.answers])
          },
          err=>console.log("greska pri ucitavanju questions")
        )

      },
      err=>console.log("greska u ucitavanju answera liste "+err)
    )

  }

  nazad(examTest:ExamTest){
    this.router.navigate(['/proftestdetails'],{state:{data:examTest}})
  }

  trackByIdx(i){
    return i
  }

}
