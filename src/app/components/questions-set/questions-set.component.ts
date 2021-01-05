import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {  Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';
import { Exam } from 'src/app/model/exam';
import { ExamTest } from 'src/app/model/examTest';
import { Question } from 'src/app/model/question';
import { ExamTestsAndQuestionsService } from 'src/app/services/exam-tests-and-questions.service';

@Component({
  selector: 'app-questions-set',
  templateUrl: './questions-set.component.html',
  styleUrls: ['./questions-set.component.css'],

})
export class QuestionsSetComponent implements OnInit {

  exam:Exam
  examDate:Date
  questionList:Question[]=[]
  examTest:ExamTest

  pitanjeForm=this.formBuilder.group({
    pitanje:["",Validators.required],
    odgovor1:["",Validators.required],
    odgovor2:["",Validators.required],
    odgovor3:["",Validators.required],
    odgovor4:["",Validators.required],
    opis:["",Validators.required],
  })

  examTestForm=this.formBuilder.group({
    id:[""],
    tema:["",Validators.required],
    testStart:["",Validators.required],
    trajanje:["",[Validators.required,Validators.max(120),Validators.min(0),Validators.pattern('[0-9]*')]],
    bodovi:["",[Validators.required,Validators.max(100),Validators.min(0),Validators.pattern('[0-9]*')]],
  })

  constructor(private formBuilder:FormBuilder,private snackBar:MatSnackBar,private router:Router,
    public dialog: MatDialog,private examTestService:ExamTestsAndQuestionsService) { }

  ngOnInit(): void {
     //primamo ceo objekat Exam preko brauzera history.state.data(ime objekta data)
   this.exam=window.history.state.data
   this.examDate=this.exam.examStart
  }

  onSubmitPitanje(value:any){
    let question=new Question();
    question.pitanje=value.pitanje
    question.odgovor1=value.odgovor1
    question.odgovor2=value.odgovor2
    question.odgovor3=value.odgovor3
    question.odgovor4=value.odgovor4
    question.opis=value.opis
    this.questionList.push(question)

  }

  onSubmitTest(value:any){
    console.log("postavljam pitanje")
    if(this.questionList.length===0){
      this.snackBar.open("Morate odabrati pitanja!","",{duration:2500})
      return
    }
    let test=new ExamTest()
    test.bodovi=value.bodovi
    test.trajanje=value.trajanje
    test.tema=value.tema
    test.testStart=value.testStart
    test.exam=this.exam
    test.questions=this.questionList

    // let's call our modal window
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Uneti Test za ispit iz: ${this.exam.course.name}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
       this.examTestService.insertTests(test).subscribe(
         data=> {
          this.examTest
          this.snackBar.open("Test je uspesno kreiran","",{duration:2500})
          this.router.navigate(["/profexamdetails"],{state:{data:this.exam}})
         } ,
         err=>{
          console.log("neuspesno insertovanje ExamTesta")
          this.snackBar.open("Test nije uspesno kreiran","",{duration:2500})
         }
       )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }

  izbaci(question:Question){
    this.questionList= this.questionList.filter(que=>{
      if(que.pitanje!==question.pitanje){
        return que
      }
    })
  }

  onClear(){}

  onCancel(){}

  trackByIdx(i) {
    return i;
  }

}
