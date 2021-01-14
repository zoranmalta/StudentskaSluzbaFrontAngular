import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { JwtModule, JwtInterceptor } from "@auth0/angular-jwt";
import { LoginComponent } from './components/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { CourseComponent } from './components/course/course.component';
import { DocumentComponent } from './components/document/document.component';
import { StaffComponent } from './components/staff/staff.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card';
import { DialogYesNoComponent } from './dialogs/dialog-yes-no/dialog-yes-no.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar' 
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule }  from '@angular/material/icon';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CourseDetailsComponent } from './components/course-details/course-details.component'
import { MatSelectModule } from '@angular/material/select';
import { ExamComponent } from './components/exam/exam.component'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AdminGuard } from './auth/admin.guard';
import { ExamRegistrationComponent } from './components/exam-registration/exam-registration.component';
import { ProfExamComponent } from './components/prof-exam/prof-exam.component';
import { ProfExamDetailsComponent } from './components/prof-exam-details/prof-exam-details.component';
import { PassedExamsComponent } from './components/passed-exams/passed-exams.component';
import { PaymentComponent } from './components/payment/payment.component';
import { QuestionsSetComponent } from './components/questions-set/questions-set.component';
import { ShowCoursesComponent } from './components/show-courses/show-courses.component';
import { ExamTestRegistrationComponent } from './components/exam-test-registration/exam-test-registration.component';
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from '@stomp/ng2-stompjs';

import { myRxStompConfig } from './my-rx-stomp.config';
import { ExamTestComponent } from './components/exam-test/exam-test.component';
import { DecodeHtmlString } from './pipe/decodeHtmlString';
import { ProfTestDetailsComponent } from './components/prof-test-details/prof-test-details.component';
import { TestStudentComponent } from './components/test-student/test-student.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentComponent,
    HomePageComponent,
    PageNotFoundComponent,
    MainMenuComponent,
    CourseComponent,
    DocumentComponent,
    StaffComponent,
    NavbarComponent,
    DialogYesNoComponent,
    CourseDetailsComponent,
    ExamComponent,
    ExamRegistrationComponent,
    ProfExamComponent,
    ProfExamDetailsComponent,
    PassedExamsComponent,
    PaymentComponent,
    QuestionsSetComponent,
    ShowCoursesComponent,
    ExamTestRegistrationComponent,
    ExamTestComponent,
    DecodeHtmlString,
    ProfTestDetailsComponent,
    TestStudentComponent 
  ],
  entryComponents: [DialogYesNoComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
      }
    }),
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatListModule,
    MatSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    MatIconModule,
    MatGridListModule,
    ScrollingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },AdminGuard,
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
