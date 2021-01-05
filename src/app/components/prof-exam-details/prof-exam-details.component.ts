import { Component, OnInit, ViewChild } from '@angular/core';
import { Exam } from 'src/app/model/exam';
import { ExamService } from 'src/app/services/exam.service';
import { ExamRegistration } from 'src/app/model/examRegistration';
import { Student } from 'src/app/model/student';
import { Engagement } from 'src/app/model/engagement';
import { Staff } from 'src/app/model/staff';
import { CourseService } from 'src/app/services/course.service';
import { Validators, FormBuilder } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExamTest } from 'src/app/model/examTest';
import { ExamTestsAndQuestionsService } from 'src/app/services/exam-tests-and-questions.service';


@Component({
  selector: 'app-prof-exam-details',
  templateUrl: './prof-exam-details.component.html',
  styleUrls: ['./prof-exam-details.component.css']
})
export class ProfExamDetailsComponent implements OnInit {

  exam:Exam
  students:Student[]
  staffList:Staff[]
  examTestList:ExamTest[]=[]
  engagements:Engagement[]
  examRegistrationList:ExamRegistration[]=[]
  showInsertStudentMark:boolean=false
  selectedStudent:Student

  canAddPoints:boolean=false;
  canArhivate:boolean=false;
  canSetQuestions:boolean=false;

  dataSource:any;
  displayedColumns: string[] = ['cardNumber', 'firstName', 'lastName','points','mark','pass', 'details'];
  matcher = new MyErrorStateMatcher();
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;

  examRegistrationForm=this.formBuilder.group({
    id:[""],
    points:["",[Validators.required,Validators.max(100),Validators.min(0),Validators.pattern('[0-9]*')]],

  })

  constructor(private examService:ExamService,private courseService:CourseService,
    private formBuilder:FormBuilder,private snackBar:MatSnackBar,private dialog:MatDialog
    ,private router:Router,private examTestService:ExamTestsAndQuestionsService) { }

  ngOnInit(): void {
     //primamo ceo objekat Exam preko brauzera history.state.data(ime objekta data)
   this.exam=window.history.state.data
   if(this.exam===undefined||this.exam===null){
     this.router.navigate(["/profexam"])
   }
   this.examService.getExamRegistrationsForExam(this.exam.id).subscribe(
     data=>{
       this.examRegistrationList=data
       this.dataSource=new MatTableDataSource(this.examRegistrationList);
       this.setStudentsFromRegistration()
       this.checkArhivateCondition()
      
     },
     error=>console.log("Greska u primanju registrations sa servera")
   )
   this.courseService.getEngagementByCourseId(this.exam.course.id).subscribe(
    data=>{
     this.engagements=data;
     this.setStaffFromEngagements()
    })
    this.canAddPoints=this.checkTime(this.exam)
    this.canSetQuestions=!this.checkTime(this.exam)
    this.examTestService.getExamTestsByExamId(this.exam.id).subscribe(
      data=>this.examTestList=data,
      err=>console.log("greska u preuzimanju exam testova sa servera")
    )
  }

  details(){
    console.log("exam poslat drugoj komponenti"+this.exam.examStart)
    //prosledjujemo objekat preko routera
    this.router.navigate(["/questionsset"],{state:{data:this.exam}})
  }

  showTest(examTest:ExamTest){

  }

  archived(){
    let checkdeleted:boolean
    this.examRegistrationList.forEach(element=>{
      if(element.deleted==false){
        this.snackBar.open(`You have to rate all students`,"",{duration:2500})
        checkdeleted=true
      }});
    if(checkdeleted==true){
      return false
    }
      
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Archive Exam in : ${this.exam.course.name}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.examService.archiveExam(this.exam).subscribe(
            data=>{
              this.snackBar.open(`Exam ${data.course.name} is archived`,"",{duration:2500})
              this.router.navigate(["profexam"])
            },
            error=>{
              console.log("neuspesno arhiviranje ")
              this.snackBar.open(`Exam is not archived`,"",{duration:2500})
            }
        )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }

  checkTime(exam:Exam){
    return new Date().valueOf() > new Date(exam.examStart).valueOf();
  }

  onSubmitPoints(examRegistrationForm){
    let examRegistrationConfirm=new ExamRegistration()
    examRegistrationConfirm.id=examRegistrationForm.id
    examRegistrationConfirm.points=examRegistrationForm.points
    examRegistrationConfirm.mark=this.calculateMark(examRegistrationConfirm.points)
    examRegistrationConfirm.pass=this.calculatePass(examRegistrationConfirm.mark)
    this.examService.finishExamRegistration(examRegistrationConfirm).subscribe(
      data=>{
      this.examRegistrationList.map((element,i)=>{
        if (element.id == data.id){
          this.examRegistrationList[i] = data;
        }
      })
      this.dataSource.data=this.examRegistrationList
      this.table.renderRows();
      this.checkArhivateCondition()
    },
      error=>console.log("greska pri ocanjivanju poena")
    )

    this.onCancel()
  }

  calculatePass(mark:number){
    if(mark==5){return false}
    else{return true}
  }

  calculateMark(points:number){
    if(points<=50){return 5}
    if(points<=60){return 6}
    if(points<=70){return 7}
    if(points<=80){return 8}
    if(points<=90){return 9}
    else{return 10}
  }

  setStudentsFromRegistration(){
    this.students=[]
    this.examRegistrationList.forEach(element => {
      if(true){
        this.students.push(element.student)
      }
   });
  }
  setStaffFromEngagements(){
    this.staffList=[]
    this.engagements.forEach(element => {
      if(element.deleted==false&&element.staff.deleted==false){
        this.staffList.push(element.staff)
      }
   });
  }
  addMark(examRegistration){
    this.selectedStudent=examRegistration.student
    this.showInsertStudentMark=true
    this.examRegistrationForm.patchValue(examRegistration)
  }

  checkArhivateCondition(){
    if(this.examRegistrationList.length===0&&!this.checkTime(this.exam)){
      this.canArhivate=false
      return
    }
    if(this.examRegistrationList.length===0 && this.checkTime(this.exam)){
      this.canArhivate=true
      return
    }
    let checkdeleted:boolean=false
    this.examRegistrationList.forEach(element=>{
      if(element.deleted==false){
        checkdeleted=true
      }});
    if(!checkdeleted){
      this.canArhivate=true
    }
  }

  onClear(){
    this.examRegistrationForm.reset()
  }

  onCancel(){
    this.showInsertStudentMark=false;
    this.examRegistrationForm.reset()
  }

}
