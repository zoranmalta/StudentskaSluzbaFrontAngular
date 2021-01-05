import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs'
import { from, Observable, Subscription } from 'rxjs';
import { Exam } from 'src/app/model/exam';
import { ExamTest } from 'src/app/model/examTest';
import { Student } from 'src/app/model/student';
import { ExamTestsAndQuestionsService } from 'src/app/services/exam-tests-and-questions.service';
import { ExamService } from 'src/app/services/exam.service';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-exam-test-registration',
  templateUrl: './exam-test-registration.component.html',
  styleUrls: ['./exam-test-registration.component.css']
})
export class ExamTestRegistrationComponent implements OnInit {

  student:Student
  examList:Exam[]=[]
  infinite:Observable<Exam[]>

  public receivedMessages: string[] = [];
  private topicSubscription: Subscription;

  constructor(private loginService:LoginService,private examTestService:ExamTestsAndQuestionsService,
    private studentService:StudentService,private examService:ExamService,private rxStompService: RxStompService ) { }

  ngOnInit(): void {
    let token = this.loginService.getToken();
    let userId=this.loginService.decodePayload(token).user.id;
    this.studentService.getStudentByUser(userId).subscribe(
      data=>{
        this.student=data
        this.examService.getExamsByStudentIdNotArchivated(this.student.id).subscribe(
          data=>{
            
            this.infinite=from([data]);
          }
        )
      },
      error=>console.log("greska pri ucitavanju ulogovanog studenta")
    )
    this.rxStompService.activate()
    this.topicSubscription = this.rxStompService.watch('/topic/examtest').subscribe((message: Message) => {

      this.examService.getExamsByStudentIdNotArchivated(this.student.id).subscribe(
        data=>{
          
            this.infinite=from([data]);
        }
      )
     
      console.log("stiglo preko websocketa: ")
    },
    err=>console.log("greska u websocketu")
    );
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
    this.rxStompService.deactivate()
  }

  onSendMessage() {
    const message = `Message generated at ${new Date}`;
    this.rxStompService.publish({destination: '/app/chat', body: message});
  }

  pocniTest(examTest){}

  trackByIdx(i) {
    return i;
  }

}
