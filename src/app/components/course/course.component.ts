import { Component, OnInit, ViewChild } from '@angular/core';
import { Course } from 'src/app/model/course';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses:Course[]=[];
  dataSource:any;
  displayedColumns: string[] = ['id', 'name','details', 'delete'];
  matcher = new MyErrorStateMatcher();

  showCourseAdd:boolean=false;

  courseForm=this.formBuilder.group({
    id:[""],
    name:["",Validators.required]
  })

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;


  constructor(public dialog: MatDialog,private snackBar:MatSnackBar,private formBuilder:FormBuilder,
              private courseService:CourseService,private router:Router) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(
      data=>{
        this.courses=data.filter(course=>{return course.deleted!=true})
        this.dataSource=new MatTableDataSource(this.courses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort;
      },
      error=>{ console.log("Error u listi courses :"+error.message) }
    )
  }
//DODAVANJE novog kursa sa forme koja je validirana
  onSubmitCourse(course:Course){
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Insert Course : ${course.name}`
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.courseService.insertCourse(course).subscribe(
          data=>{
            this.courses.push(data);
            this.dataSource.data=this.courses
            this.table.renderRows();
            console.log("Lista courses posle insserta"+this.dataSource.data.length+
                        " broj objekata u nizu "+this.dataSource.data)
            this.onCancel()
            this.snackBar.open(`Course ${data.name} created`,"",{duration:2500})
          },
          error=>{
            console.log("greska pri insertu course")
            this.snackBar.open(`Course is not created`,"",{duration:2500})
          }
        )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }
//IZMENA kursa sa forme
  onUpdate(course:Course){
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Insert Course : ${course.name}`
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.courseService.updateCourse(course).subscribe(
          data=>{
            //mapiramo niz course na item i index i zamenimo odgovarajuci item dobijenim sa servera
            this.courses.map((course, i) => {
              if (course.id == data.id){
                this.courses[i] = data;
           }
         });
            this.dataSource.data=this.courses
            this.table.renderRows();
            this.onCancel()
            this.snackBar.open(`Course ${data.name} updated`,"",{duration:2500})
          },
          error=>{
            console.log("greska pri update course")
            this.snackBar.open(`Course is not updated`,"",{duration:2500})
          }
        )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });

  }

  onClear(){
    this.courseForm.reset();
  }

  onCancel(){
    this.showCourseAdd=false;
    this.courseForm.reset()
  }

  onAddCourse(){
    this.showCourseAdd=true;
  }
  deleteCourse(course:Course){
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Delete Course : ${course.name}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.courseService.deleteCourse(course).subscribe(
            data=>{
              this.courses=this.courses.filter((course, i) => {
                return course.id!=data.id
              });
              this.dataSource.data=this.courses
              this.table.renderRows();
              this.courseForm.reset()
              console.log("uspesno brisanje "+data)
              this.snackBar.open(`Course ${data.name} deleted`,"",{duration:2500})
            },
            error=>{
              console.log("neuspesno brisanje ")
              this.snackBar.open(`Course is not deleted`,"",{duration:2500})
            }
        )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }
  details(course:Course){
    console.log("course poslat drugoj komponenti"+course.name)
    //prosledjujemo objekat preko routera
    this.router.navigate(["/coursedatails"],{state:{data:course}})
  }
  getRowData(row:Course){
     // patchValue lepi dostupne podatke na formu
    this.courseForm.patchValue(row)
  }

  //event uzima element sa htmla i njegovu vrednost koju prosledjuje filteru
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
