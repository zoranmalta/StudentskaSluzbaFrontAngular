import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Exam } from 'src/app/model/exam';
import { ExamRegistration } from 'src/app/model/examRegistration';
import { ExamForStudent } from 'src/app/model/examForStudent';
import { ExamService } from 'src/app/services/exam.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';
import { Payment } from 'src/app/model/payment';

@Component({
  selector: 'app-exam-registration',
  templateUrl: './exam-registration.component.html',
  styleUrls: ['./exam-registration.component.css']
})
export class ExamRegistrationComponent implements OnInit {

  dataSource:any;
  student:Student;
  examList:Exam[]=[]
  examRegistrationList:ExamRegistration[]=[]
  examForStudentList:ExamForStudent[]=[]
  displayedColumns: string[] = ['id', 'period', 'courseName','examStart','registered'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;

  examForm=this.formBuilder.group({
    id:[''],
    period:[''],
    courseName:[''],
    examStart:[''],
    registered:['']
  })

  constructor(private examService:ExamService,private loginService:LoginService
        ,private studentService:StudentService,private formBuilder:FormBuilder
        ,public dialog: MatDialog,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    let token = this.loginService.getToken();
    let userId=this.loginService.decodePayload(token).user.id;
    
    this.studentService.getStudentByUser(userId).subscribe(
      data=>{
        this.student=data
        this.examService.getExamsForStudent(this.student.id).subscribe(
          data=>{ data.forEach(element => {
            let examForStudent=new ExamForStudent();
            examForStudent.exam=element
            examForStudent.registered=false
            this.examForStudentList.push(examForStudent)
          })
            this.dataSource=new MatTableDataSource(this.examForStudentList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort=this.sort;
            this.examService.getExamsForStudentNotRegistration(this.student.id).subscribe(
              data=>{this.examForStudentList.forEach(exam=>{
                data.forEach(dataExam=>{
                  if(exam.exam.id==dataExam.id){
                    exam.registered=true
                  }
                })
              })
            },
              error=>{ console.log("greska u getExamsForStudentNotRegistration")}
            )
        },
          error=>console.log("Greska u ucitavanju examForStudent")
        )
      },
      error=>{console.log("greska u ucitavanju studenta")}
    )
  }
// sa tabele dobijamo objekat ExamForStudent{exam,registered} index reda tabele i vrednost checkboxa reda
// ovo je reakcija na click checkboxa 
  onSubmitRegistration(examForStudent:ExamForStudent,index:number,myCheckBox:boolean){
    console.log("proba za checkbox : " +myCheckBox)
    if(myCheckBox==true){
      if(this.student.accountBalance<200){
        this.snackBar.open("You don't have enough money!!!","",{duration:3000})
        return false
      }
      this.insertRegistrationWithDialog(examForStudent,index,myCheckBox)
      
    }else{
      console.log("Odjavljujemo ispit trba da je false: " + myCheckBox)
      this.deleteRegistrationWithDialog(examForStudent,index)
      
    }
  }

  insertPayment(){
    let payment=new Payment()
    payment.onePaymentChange=-200;
    payment.reason="prijava ispita";
    payment.student=this.student
    console.log("poceo insert payment")
    this.studentService.insertPayment(payment).subscribe(
      data=>{console.log("uspesno upisan payment")},
      error=>{console.log("error u insertu paymenta")}
    )
  }

  deletePayment(){
    let payment=new Payment()
    payment.onePaymentChange=+200;
    payment.reason="odjava ispita";
    payment.student=this.student
    console.log("poceo delete payment")
    this.studentService.insertPayment(payment).subscribe(
      data=>{console.log("uspesno upisan payment")},
      error=>{console.log("error u insertu paymenta")}
      )
  }

  deleteRegistrationWithDialog(examForStudent:ExamForStudent,index:number){
    let examRegistration=new ExamRegistration();
    examRegistration.exam=examForStudent.exam
    examRegistration.student=this.student
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Delete Registration of Exam : ${examRegistration.exam.course.name}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.deleteRegistration(examRegistration,index)
        this.deletePayment()
      }else{
        console.log("index u no dialog : "+index)
        this.examForStudentList[index].registered=true;
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }

  deleteRegistration(examRegistration:ExamRegistration,index:number){
    this.examService.deleteExamRegistration(examRegistration).subscribe(
      data=>{
        this.examForStudentList[index].registered=false;
        console.log("obrisan examRegistration")
        this.snackBar.open("the exam registration is deleted","",{duration:2500})
      },
      error=>{
        console.log("greska pri delete registration")
        this.examForStudentList[index].registered=true;
        this.snackBar.open("the registration is not deleted","",{duration:2500})
      }
    )
  }
  
  insertRegistrationWithDialog(examForStudent:ExamForStudent,index:number,myCheckBox:boolean){
    let examRegistration=new ExamRegistration();
    examRegistration.exam=examForStudent.exam
    examRegistration.examApplication=new Date();
    examRegistration.mark=0
    examRegistration.points=0
    examRegistration.student=this.student
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Registration of Exam : ${examRegistration.exam.course.name}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.insertRegistration(examRegistration,index)
        this.insertPayment()
      }else{
        console.log("index u no dialog : "+index)
        this.examForStudentList[index].registered=false;
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }

  insertRegistration(examRegistration:ExamRegistration,index:number){
    this.examService.insertExamRegistration(examRegistration).subscribe(
      data=>
      this.examForStudentList.map(element=>{
        if(element.exam.id==data.exam.id){
          element.registered=true
        }
        this.dataSource.data=this.examForStudentList
        console.log("ucitan examRegistration")
        this.snackBar.open("the exam is registered","",{duration:2500})
      }),
      error=>{
        console.log("greska pri insertu registration")
        this.examForStudentList[index].registered=false;
        this.snackBar.open("the exam is not registered","",{duration:2500})
      }
    )
  }

  getRowData(row:any){}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
