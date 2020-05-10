import { Component, OnInit, ViewChild } from '@angular/core';
import { Exam } from 'src/app/model/exam';
import { Course } from 'src/app/model/course';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CourseService } from 'src/app/services/course.service';
import { ExamService } from 'src/app/services/exam.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';
import { Staff } from 'src/app/model/staff';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prof-exam',
  templateUrl: './prof-exam.component.html',
  styleUrls: ['./prof-exam.component.css']
})
export class ProfExamComponent implements OnInit {

  examList:Exam[]=[]
  courses:Course[]=[]
  loggedInstaff:Staff
  loggedInTime:Date
  dataSource:any;
  displayedColumns: string[] = ['id', 'period', 'courseName','examStart','details'];
  matcher = new MyErrorStateMatcher();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;

  constructor(private courseService:CourseService,private loginService:LoginService
    ,private staffService:StaffService,private examService:ExamService
    ,public dialog: MatDialog,private snackBar:MatSnackBar,private router:Router) { }

  ngOnInit(): void {
    let token = this.loginService.getToken();
    let userId=this.loginService.decodePayload(token).user.id;
    this.staffService.getStaffByUser(userId).subscribe(
      data=>{
        this.loggedInstaff=data
        this.examService.getExamsForStaff(this.loggedInstaff.id).subscribe(
          data => {
            console.log("Lista ispita success: "+data)
            this.examList=data.filter(e=>{return e.archived!=true})
            //objekat koji prima listu i omogucuje sort pag i ostale stvari
            this.dataSource=new MatTableDataSource(this.examList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort=this.sort;
          },
          error=>{console.log("error u listi exam"+error)}
        )
      },
      error=>console.log("nije ucitan loggedinstaff od usera")
    )
    this.loggedInTime=new Date();
  }
  checkTime(exam:Exam){
    return new Date(this.loggedInTime).valueOf() > new Date(exam.examStart).valueOf();
  }

  details(exam:Exam){
    console.log("course poslat drugoj komponenti"+exam.examStart)
    //prosledjujemo objekat preko routera
    this.router.navigate(["/profexamdetails"],{state:{data:exam}})
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
