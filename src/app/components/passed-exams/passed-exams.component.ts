import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { ExamRegistration } from 'src/app/model/examRegistration';
import { ExamService } from 'src/app/services/exam.service';

@Component({
  selector: 'app-passed-exams',
  templateUrl: './passed-exams.component.html',
  styleUrls: ['./passed-exams.component.css']
})
export class PassedExamsComponent implements OnInit {

  loggedInStudent:Student
  examRegistrationList:ExamRegistration[]=[]
  dataSource:any
  displayedColumns: string[] = ['position', 'name', 'mark'];
  matcher = new MyErrorStateMatcher();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;

  constructor(private loginService:LoginService,private studentService:StudentService
    ,private examService:ExamService) { }

  ngOnInit(): void {
    let token = this.loginService.getToken();
    let userId=this.loginService.decodePayload(token).user.id;
    this.studentService.getStudentByUser(userId).subscribe(
      data=>{
        this.loggedInStudent=data
        this.examService.getFinishedExamRegistrations(this.loggedInStudent.id).subscribe(
          data=>{
            this.examRegistrationList=data
             //objekat koji prima listu i omogucuje sort pag i ostale stvari
             this.dataSource=new MatTableDataSource(this.examRegistrationList);
             this.dataSource.paginator = this.paginator;
             this.dataSource.sort=this.sort;
          },
          error=>console.log("greska u polozenim ispitima")
        )
      },
      error=>console.log("greska u ucitavanju studenta")
    )
  }

  getAverageMark(){
    let total=0
    let i=0
    this.examRegistrationList.map(t =>{
      total=total+t.mark
      i++
    })
    return total/i
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
