import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/model/course';
import { Student } from 'src/app/model/student';
import { CourseService } from 'src/app/services/course.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-show-courses',
  templateUrl: './show-courses.component.html',
  styleUrls: ['./show-courses.component.css']
})
export class ShowCoursesComponent implements OnInit {

  courseList:Course[]=[]
  student:Student

  constructor(private courseService :CourseService,private loginService:LoginService
    ,private studentService:StudentService) { }

  ngOnInit(): void {
    let token = this.loginService.getToken();
    let userId=this.loginService.decodePayload(token).user.id;

    this.studentService.getStudentByUser(userId).subscribe(
      data=>{
        this.student=data
        this.courseService.getCoursesByStudentId(this.student.id).subscribe(
          data=>{
            this.courseList=data 
          },
          error=>console.log("greska pri ucitavanju predmeta")
        )
      },
      error=>console.log("greska pri ucitavanju ulogovanog studenta")
    )
  
  }

}
