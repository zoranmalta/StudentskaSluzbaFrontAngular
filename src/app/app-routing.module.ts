import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './components/student/student.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CourseComponent } from './components/course/course.component';
import { DocumentComponent } from './components/document/document.component';
import { StaffComponent } from './components/staff/staff.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { ExamComponent } from './components/exam/exam.component';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from './auth/admin.guard';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ExamRegistrationComponent } from './components/exam-registration/exam-registration.component';
import { ProfExamComponent } from './components/prof-exam/prof-exam.component';
import { ProfExamDetailsComponent } from './components/prof-exam-details/prof-exam-details.component';
import { PassedExamsComponent } from './components/passed-exams/passed-exams.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ShowCoursesComponent } from './components/show-courses/show-courses.component';
import { QuestionsSetComponent } from './components/questions-set/questions-set.component';
import { ExamTestRegistrationComponent } from './components/exam-test-registration/exam-test-registration.component';
import { ExamTestComponent } from './components/exam-test/exam-test.component';
import { ProfTestDetailsComponent } from './components/prof-test-details/prof-test-details.component';
import { TestStudentComponent } from './components/test-student/test-student.component';

const routes: Routes = [
  { path : "home" , component : HomePageComponent},
  { path : "login" , component : LoginComponent},
  { path : "student", component : StudentComponent,canActivate:[AdminGuard]},
  { path : "course" , component : CourseComponent,canActivate:[AdminGuard]},
  { path : "coursedatails" , component : CourseDetailsComponent,canActivate:[AdminGuard]},
  { path : "exam" , component:ExamComponent,canActivate:[AdminGuard]},
  { path : "document", component : DocumentComponent,canActivate:[AdminGuard]},
  { path : "staff" , component : StaffComponent,canActivate:[AdminGuard]},
  { path: 'sidemenu' , outlet : 'sidemenu', component : MainMenuComponent},
  { path: 'anything' , outlet : 'sidemenu', component : MainMenuComponent},

  { path : "showcourses" , component : ShowCoursesComponent },
  { path : "payment" , component : PaymentComponent },
  { path : "examtest" , component : ExamTestComponent },
  { path : "passedexams" , component : PassedExamsComponent },
  { path : "examregistration" , component : ExamRegistrationComponent },
  { path : "examtestregistrationcomponent" , component : ExamTestRegistrationComponent},

  { path : "profexamdetails" , component : ProfExamDetailsComponent },
  { path : "proftestdetails" , component : ProfTestDetailsComponent },
  { path : "profexam" , component : ProfExamComponent },
  { path : "questionsset" , component: QuestionsSetComponent},
  { path : "teststudent" , component : TestStudentComponent },

  { path : "**" , component : PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }


