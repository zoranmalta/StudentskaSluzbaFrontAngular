import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from 'src/app/model/student';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/model/course';
import { StudentService } from 'src/app/services/student.service';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/services/course.service';
import { Enrollment } from 'src/app/model/enrollment';
import { element } from 'protractor';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';
import { MatDialog } from '@angular/material/dialog';
import { Engagement } from 'src/app/model/engagement';
import { Staff } from 'src/app/model/staff';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  @ViewChild('allSelected') private allSelected: MatListOption;
  @ViewChild('selectedStudents') private selectedStudents:MatSelectionList;
  @ViewChild('allSelectedForAdd') private allSelectedForAdd:MatListOption
  @ViewChild('selectedStudentsForAdd') private selectedStudentsForAdd:MatSelectionList;

  course:Course
  enrollments:Enrollment[]=[]
  engagements:Engagement[]=[]
// mala lista personal koji predaje predmet
  staffList:Staff[]=[]
  selectedStaffOptions:Staff[]=[]
  engagementsToDelete:Engagement[]=[]
//lista 1 studenti koji pohadjaju
  students:Student[]=[]
  selectedOptions:Student[]=[]
  enrollmentsToDelete:Enrollment[]=[]
//lista 2 studenti koji ne pohadjaju (za dodavanje)
  studentsForAdd:Student[]=[]
  selectedOptionsForAdd:Student[]=[]
  enrollmentsToAdd:Enrollment[]=[]
//lista 3 personal koji ne predaje (za dodavanje)
  staffForAdd:Staff[]=[]
  selectedStaffOptionsForAdd:Staff[]=[]
  engagementsToAdd:Engagement[]=[]

  showStudentsEnroll:boolean=true;
  showStudentsForAdd:boolean=false;
  showStaffEngaged:boolean=true;
  showStaffForEngaged:boolean=false;

  constructor(private activatedRoute:ActivatedRoute,public dialog: MatDialog
        ,private studentService:StudentService,private staffService:StaffService
        ,private snackBar:MatSnackBar,private courseService:CourseService) { }

  ngOnInit(): void {
    //primamo ceo objekat Course preko brauzera history.state.data(ime objekta data)
   this.course=window.history.state.data
   this.courseService.getEnrollmentsByCourseId(this.course.id).subscribe(
      data=>{
        this.enrollments=data
        this.setStudentsFromEnrollments()
      },
      error=>console.log("Greska u primanju enrollmentsa sa servera")
   )
   this.courseService.getEngagementByCourseId(this.course.id).subscribe(
     data=>{
      this.engagements=data;
      this.setStaffFromEngagements()
     } 
   )
  }

  setStudentsFromEnrollments(){
    this.students=[]
    this.enrollments.forEach(element => {
      if(element.deleted==false&&element.student.deleted==false){
        this.students.push(element.student)
      }
   });
  }
//UKLANJA STAFF iz course tj brise engagements deleted=true
  deleteSelctedStaff(){
    if(this.selectedStaffOptions.length==0){
      this.snackBar.open(`Morate izabrati Profesora`,"",{duration:3000})
      return false;
    }
    this.cancelAddStaff()
    this.filterListForDeleteStaff()
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Remove Staff from Course: ${this.engagementsToDelete.length} person/s`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult == true){
        this.courseService.deleteEngagementsByList(this.engagementsToDelete).subscribe(
          data=>{
            //u listi engagements obelezava deleted na true i tako ih posle ne prikazuje
            this.engagements.map(enroll=>{
              data.forEach(element => {
                if(enroll.id==element.id)
                enroll.deleted=true
              });
            })
            this.setStaffFromEngagements()
            this.snackBar.open(`${this.engagementsToDelete.length} Profesor is removed`,"",{duration:2500})
            this.engagementsToDelete=[]
            this.selectedStaffOptions=[]
          },
          error=>{
            console.log("error ur brisanjeu engagementsa")
          this.snackBar.open(`Staff are not removed`,"",{duration:2500})
          }
        )
      }else{ 
        this.snackBar.open(`Canceled `,"",{duration:2500})
        this.engagementsToDelete=[]
        this.selectedStaffOptions=[]
     }
    })
  }
//DODAJE STAFF u course tj insertuje listu engagements i prikazuje na stranici
  addSelectedStaff(){
    if(this.selectedStaffOptionsForAdd.length==0){
      this.snackBar.open(`Morate izabrati personal`,"",{duration:3000})
      return false;
    }
    this.filterListForAddEngagements()
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Add Staff to Course `
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult == true){
        this.courseService.insertEngagements(this.engagementsToAdd).subscribe(
          data=>{ 
            data.forEach(element => {
              this.engagements.push(element)
            });
            this.setStaffFromEngagements()
            this.snackBar.open(`${this.engagementsToAdd.length} Staff are Added`,"",{duration:2500})
            this.engagementsToAdd=[]
            this.selectedStaffOptionsForAdd=[]
            this.cancelAddStaff()
          },
          error=>{
            console.log("error ur insertu enrollmentsa")
          this.snackBar.open(`Staff are not added`,"",{duration:2500})
          this.cancelAddStaff()
          }
        )
      }else{ 
        this.snackBar.open(`Canceled `,"",{duration:2500})
        this.engagementsToAdd=[]
        this.selectedStaffOptionsForAdd=[]
        this.cancelAddStaff()
     }
    });
  }

  filterListForAddEngagements(){
    this.engagementsToAdd=[]
    console.log("duzina liste : "+this.selectedStaffOptionsForAdd.length)
    this.selectedStaffOptionsForAdd.forEach(element => {
      let engagement=new Engagement();
      engagement.course=this.course
      engagement.staff=element
      console.log("dodati engagement : "+engagement.staff.firstName+ "  i "+engagement.course.name)
      this.engagementsToAdd.push(engagement)
    });
  }

  cancelAddStaff(){
    this.showStaffForEngaged=false;
    this.showStudentsEnroll=true;
    this.staffForAdd=[]
    this.selectedStaffOptionsForAdd=[]
    this.engagementsToAdd=[]
  }

  displayStaffForAdd(){
    this.showStudentsEnroll=false;
    this.showStudentsForAdd=false;
    this.showStaffForEngaged=true;
    this.selectedStaffOptions=[]
    this.engagementsToDelete=[]
    this.staffForAdd=[]
    this.selectedStaffOptionsForAdd=[]
    this.staffService.getStaffNotEngagedByCourseId(this.course.id).subscribe(
      data=> 
        data.forEach(element => {
          if(element.deleted==false){
            this.staffForAdd.push(element)
          }
      }),
      error=>console.log("greska pri ucitavanju personala u listu za dodavanje")
    )
  }

  filterListForDeleteStaff(){
    this.engagementsToDelete=[]
    this.engagements.forEach(engagement => {
      if(!engagement.deleted){
        this.selectedStaffOptions.forEach(staff => {
          if(engagement.staff.id==staff.id&&!staff.deleted){
            this.engagementsToDelete.push(engagement)
          }
        });
      }
    });
  }

  //sinhronizuje stanje staffList liste u odnosu na engagements listu
  setStaffFromEngagements(){
    this.staffList=[]
    this.engagements.forEach(element => {
      if(element.deleted==false&&element.staff.deleted==false){
        this.staffList.push(element.staff)
      }
   });
  }

//prikazuje studente koji ne pohadjaju odredjeni course
  displayStudentsForAdd(){
    this.showStudentsEnroll=false;
    this.showStaffForEngaged=false;
    this.showStudentsForAdd=true;
    this.enrollmentsToDelete=[]
    this.selectedOptions=[]
    this.studentsForAdd=[]
    this.selectedOptionsForAdd=[]
    this.studentService.getStudentsNotEnrolledByCourseId(this.course.id).subscribe(
      data=>{
        data.forEach(element => {
          if(element.deleted==false){
            this.studentsForAdd.push(element)
          }
        });
      },
      error=>console.log("greska ucitavanje studenata za listu add")
    )
  }
//DODAJE studente na odredjeni course
  addSelectedStudents(){
    if(this.selectedOptionsForAdd.length==0){
      this.snackBar.open(`Morate izabrati studenta`,"",{duration:3000})
      return false;
    }
    this.filterListForAddEnrollments()
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Add Students to Course `
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult == true){
        this.courseService.insertEnrollments(this.enrollmentsToAdd).subscribe(
          data=>{ 
            data.forEach(element => {
              this.enrollments.push(element)
            });
            this.setStudentsFromEnrollments()
            this.snackBar.open(`${this.enrollmentsToAdd.length} Students are Added`,"",{duration:2500})
            this.enrollmentsToAdd=[]
            this.selectedOptionsForAdd=[]
            this.cancelAddStudents()
          },
          error=>{
            console.log("error ur insertu enrollmentsa")
          this.snackBar.open(`Student are not added`,"",{duration:2500})
          this.cancelAddStudents()
          }
        )
      }else{ 
        this.snackBar.open(`Canceled `,"",{duration:2500})
        this.enrollmentsToAdd=[]
        this.selectedOptionsForAdd=[]
        this.cancelAddStudents()
     }
    });
  }

  filterListForAddEnrollments(){
    console.log("duzina liste : "+this.selectedOptionsForAdd.length)
    this.selectedOptionsForAdd.forEach(element => {
      let enroll=new Enrollment();
      enroll.course=this.course
      enroll.student=element
      console.log("dodati enrollment : "+enroll.student.cardNumber+ "  i "+enroll.course.name)
      this.enrollmentsToAdd.push(enroll)
    });
  }
//odustajanje od dodavanja studenata na odredjeni course
  cancelAddStudents(){
    this.showStudentsForAdd=false;
    this.showStudentsEnroll=true;
    this.studentsForAdd=[]
    this.selectedOptionsForAdd=[]
  }
//UKLANJA studente koji pohadjaju odredjeni course
  deleteSelectedStudents(){
    if(this.selectedOptions.length==0){
      this.snackBar.open(`Morate izabrati studenta`,"",{duration:3000})
      return false;
    }
    this.filterListForDelete()
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Remove Students from Course: ${this.enrollmentsToDelete.length} person/s`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult == true){
        this.courseService.deleteEnrollmentsByList(this.enrollmentsToDelete).subscribe(
          data=>{
            //u listi enrollments obelezava deleted na true i tako ih posle ne prikazuje
            this.enrollments.map(enroll=>{
              data.forEach(element => {
                if(enroll.id==element.id)
                enroll.deleted=true
              });
            })
            this.setStudentsFromEnrollments()
            this.snackBar.open(`${this.enrollmentsToDelete.length} Students are removed`,"",{duration:2500})
            this.enrollmentsToDelete=[]
            this.selectedOptions=[]
          },
          error=>{
            console.log("error ur brisanjeu enrollmentsa")
          this.snackBar.open(`Student are not removed`,"",{duration:2500})
          }
        )
      }else{ 
        this.snackBar.open(`Canceled `,"",{duration:2500})
        this.enrollmentsToDelete=[]
        this.selectedOptions=[]
     }
    });
  }
  //sinhronizuje stanje students liste u odnosu na enrollments listu
 //formira listu enrollmentsToDelete za slanje na server
  filterListForDelete(){
    this.enrollmentsToDelete=[]
    this.enrollments.forEach(enroll => {
      this.selectedOptions.forEach(stud => {
        if(enroll.student.id==stud.id){
          this.enrollmentsToDelete.push(enroll)
        }
      });
    });
  }
  //samo prikaz eventa koji se trigeruje promenom selectedOptions stanja ako zatreba
  onNgModelChange(event){
    console.log('on ng model change', event);
  }
  //reakcija na click allSelection mat-option
  toggleAllSelection(){
    if (this.allSelected.selected){
      this.selectedStudents.selectAll()
      this.selectedOptions.splice(0,1)
    }else{
      this.selectedStudents.deselectAll()
    }
  }//reakcija na click pojedinacne selekcije
  togglePerOne(){
    if (this.allSelected.selected) {  
      this.allSelected.toggle();
      return false;
    }
    if(this.selectedOptions.length==this.students.length){
      console.log("usaou if !!!")
      this.allSelected.toggle()
      this.selectedOptions.splice(0,1)
    }
  }

  toggleAllSelectionForAdd(){
    if (this.allSelectedForAdd.selected){
      this.selectedStudentsForAdd.selectAll()
      this.selectedOptionsForAdd.splice(0,1)
    }else{
      this.selectedStudentsForAdd.deselectAll()
    }
  }

  togglePerOneForAdd(){
    if (this.allSelectedForAdd.selected) {  
      this.allSelectedForAdd.toggle();
      return false;
    }
    if(this.selectedOptionsForAdd.length==this.studentsForAdd.length){
      console.log("usaou if !!!")
      this.allSelectedForAdd.toggle()
      this.selectedOptionsForAdd.splice(0,1)
    }
  }

}
