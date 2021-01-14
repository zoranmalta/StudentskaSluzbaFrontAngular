import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map, mergeMap, scan, tap, throttleTime } from 'rxjs/operators';
import { Answer } from 'src/app/model/answer';
import { ExamTest } from 'src/app/model/examTest';
import { Question } from 'src/app/model/question';
import { Student } from 'src/app/model/student';
import { WorkTest } from 'src/app/model/workTest';
import { ExamTestsAndQuestionsService } from 'src/app/services/exam-tests-and-questions.service';

@Component({
  selector: 'app-exam-test',
  templateUrl: './exam-test.component.html',
  styleUrls: ['./exam-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamTestComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport:CdkVirtualScrollViewport;

  examTest:ExamTest
  student:Student
  offset = new BehaviorSubject(0);
  batchMapSetovan:Observable<Question[]>
  infinite:Observable<any[]>
  
  page = 0;
  batch = 5;
  theEnd = false;
  kombinacije:number[][]=[[2,1,3,4],[2,1,4,3],[2,3,1,4],[2,3,4,1],[2,4,1,3],[2,4,3,1],
                          [3,1,2,4],[3,1,4,2],[3,2,1,4],[3,2,4,1],[3,4,1,2],[3,4,2,1],
                          [1,2,3,4],[1,2,4,3],[1,3,2,4],[1,3,4,2],[1,4,2,3],[1,4,3,2],
                          [4,1,2,3],[4,1,3,2],[4,2,1,3],[4,2,3,1],[4,3,1,2],[4,3,2,1] ];

  questionList:Question[]=[]  
  questionsAll:Question[]=[]
  counter:number=0
  tacniOdgovori:number=0

  workTest:WorkTest

  timeRemaining:number
 
  constructor(private snackBar:MatSnackBar,private examTestService:ExamTestsAndQuestionsService
    ,private router:Router) { }
 
  ngOnInit(): void {
     //primamo ceo objekat ExamTest preko brauzera history.state.data(ime objekta data)
    this.examTest=window.history.state.data
    if(!this.examTest){
      this.router.navigate(['/home'])
    }
    this.student=window.history.state.user
    
    const batchMap = this.offset.pipe(
        throttleTime(500),
        mergeMap(val=>this.getBatch(this.examTest.id,val,this.batch)),
        scan<Object[]>((allResponses, currentResponse) => 
        [...allResponses, currentResponse], []),
        map(arr => [].concat(...arr))
    )
    this.infinite=batchMap
    this.timeRemaining=Math.floor(new Date(this.examTest.testStart).getTime()/1000+this.examTest.trajanje*60-new Date().getTime()/1000)
    interval(1000).subscribe(val=>{
  
      this.setValue(this.timeRemaining-val)
      if((this.timeRemaining-val<= (-10))){
        this.zavrsiTest()
      }
    })
    
    this.examTestService.getQuestionsByExamTestAll(this.examTest.id).subscribe(
      data=>{
        this.questionsAll=data
        this.createWorkTest()
      },
      err=>console.log("greska u ucitavanju liste pitanja"+err)
    )
  }

  ngOnDestroy() {
   this.insertTest()
  }

  insertTest(){
    this.examTestService.insertWorkTest(this.workTest).subscribe(
      data=>{
        this.snackBar.open("Uspesno predat test","",{duration:2500})
      },
      err=>{
        
      }
    )
  }

  zavrsiTest(){
    this.router.navigate(['/examtestregistrationcomponent'])
  }

  createWorkTest(){
    this.workTest=new WorkTest()
    this.workTest.examTest=this.examTest
    this.workTest.student=this.student
    this.workTest.bodovi=0
    this.questionsAll.forEach(
      q=>{
        let answer=new Answer()
        answer.question=q
        this.workTest.answers.push(answer)
      }
    )
  }

  getElem = (id: string): HTMLElement => document.getElementById(id);
  setValue = (val: number) => {
    if(val<=0){
      val=0
    }
    this.getElem('counter').innerText = this.transform(val)
  }
  
  
  transform(value: number): string {
    const min: number = Math.floor(value / 60);
    const sec: number = (value - min * 60);

    if (min < 10 && sec < 10) {
        return '0' + min + ' : 0' + (value - min * 60);
    }
    if (min < 10 && sec >= 10) {
        return '0' + min + ' : ' + (value - min * 60);
    }
    if (min >= 10 && sec < 10) {
        return min + ' : 0' + (value - min * 60);
    }
    if (min >= 10 && sec >= 10) {
      return min + ' : ' + (value - min * 60);
  }
  }

  getBatch(examTestId:number,page:number,batch:number){
  
    return this.examTestService.getQuestionsByExamTestId(examTestId,page,batch)
    .pipe(tap(arr=>arr.length?null:this.theEnd=true),
          map(val=> {
              val.forEach(p=>{
                const int=Math.floor(Math.random()*23)
                const one=this.kombinacije[int]
                console.log("random kombinacija "+one)
                for (let index = 0; index < 4; index++) {
                 if(index===0){this.postavka1(one[index],p) 
                  continue;}
                 if(index===1){this.postavka2(one[index],p)
                  continue;}
                 if(index===2){this.postavka3(one[index],p) 
                  continue;}
                 if(index===3){this.postavka4(one[index],p) 
                  continue;}
                }
              })
              return val
          })
      )
  }

  postavka1(broj:number,p:Question){
    if(broj===1) {p.prikaz1=p.odgovor1;
    return;}
    if(broj===2) {p.prikaz1=p.odgovor2;
    return;}
    if(broj===3) {p.prikaz1=p.odgovor3;
    return;}
    if(broj===4) {p.prikaz1=p.odgovor4;
    return;}
  }
  postavka2(broj:number,p:Question){
    if(broj===1) {p.prikaz2=p.odgovor1;
    return;}
    if(broj===2) {p.prikaz2=p.odgovor2;
    return;}
    if(broj===3) {p.prikaz2=p.odgovor3;
    return;}
    if(broj===4) {p.prikaz2=p.odgovor4;
    return;}
  }
  postavka3(broj:number,p:Question){
    if(broj===1) {p.prikaz3=p.odgovor1;
    return;}
    if(broj===2) {p.prikaz3=p.odgovor2;
    return;}
    if(broj===3) {p.prikaz3=p.odgovor3;
    return;}
    if(broj===4) {p.prikaz3=p.odgovor4;
    return;}
  }
 postavka4(broj:number,p:Question){
    if(broj===1) {p.prikaz4=p.odgovor1;
    return;}
    if(broj===2) {p.prikaz4=p.odgovor2;
    return;}
    if(broj===3) {p.prikaz4=p.odgovor3;
    return;}
    if(broj===4) {p.prikaz4=p.odgovor4;
    return;}
  }

  nextBatch($event,questions:Question[]){
    console.log("pitanja lista duzina : "+questions.length)
    this.questionList=questions

    if(this.theEnd){
      return;
    }
    const end=this.viewport.getRenderedRange().end;
    const total=this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if(end===total){
      console.log("ucitavamo sledeci page!")
      if(!(total%this.batch)){

        this.page=total/this.batch
        console.log("page number next "+this.page)
        this.offset.next(this.page)
       this.infinite.subscribe(
         data=>{
           console.log("zajednicka observabla " ,data)
        })
      }else{
        console.log("nema vise stranica!")
      }
    }
  }

  odgovorNaPitanje1(question:Question,index:number){
    this.snackBar.open("Odgovor je prosledjen","",{duration:1200});
    question.prikaziOpis=true;
    this.counter++
    this.workTest.answers[index].odgovor=question.prikaz1
    
    if(question.prikaz1===question.odgovor1){
      question.datTacanOdgovor1=true;
      this.tacniOdgovori++
      this.workTest.answers[index].tacan=true
      this.workTest.bodovi+=question.bodovi
      return;
    }else{
      question.datNetacanOdgovor1=true;
      if(question.prikaz2===question.odgovor1){
        question.datTacanOdgovor2=true
        return;
      }
      if(question.prikaz3===question.odgovor1){
        question.datTacanOdgovor3=true
        return;
      }
      if(question.prikaz4===question.odgovor1){
        question.datTacanOdgovor4=true
        return;
      }
    }
  }
  odgovorNaPitanje2(question:Question,index:number){
    this.snackBar.open("Odgovor je prosledjen","",{duration:1200});
    question.prikaziOpis=true;
    this.counter++
    this.workTest.answers[index].odgovor=question.prikaz2
   
    if(question.prikaz2===question.odgovor1){
      question.datTacanOdgovor2=true;
      this.tacniOdgovori++
      this.workTest.answers[index].tacan=true
      this.workTest.bodovi+=question.bodovi
      return;
    }else{
      question.datNetacanOdgovor2=true;
      if(question.prikaz1===question.odgovor1){
        question.datTacanOdgovor1=true
        return;
      }
      if(question.prikaz3===question.odgovor1){
        question.datTacanOdgovor3=true
        return;
      }
      if(question.prikaz4===question.odgovor1){
        question.datTacanOdgovor4=true
        return;
      }
    }
  }
  odgovorNaPitanje3(question:Question,index:number){
    this.snackBar.open("Odgovor je prosledjen","",{duration:1200});
    question.prikaziOpis=true;
    this.counter++
    this.workTest.answers[index].odgovor=question.prikaz3
    
    if(question.prikaz3===question.odgovor1){
      question.datTacanOdgovor3=true;
      this.tacniOdgovori++
      this.workTest.answers[index].tacan=true
      this.workTest.bodovi+=question.bodovi
      return;
    }else{
      question.datNetacanOdgovor3=true;
      if(question.prikaz2===question.odgovor1){
        question.datTacanOdgovor2=true
        return;
      }
      if(question.prikaz1===question.odgovor1){
        question.datTacanOdgovor1=true
        return;
      }
      if(question.prikaz4===question.odgovor1){
        question.datTacanOdgovor4=true
        return;
      }
    }
  }
  odgovorNaPitanje4(question:Question,index:number){
    this.snackBar.open("Odgovor je prosledjen","",{duration:1200});
    question.prikaziOpis=true;
    this.counter++
    this.workTest.answers[index].odgovor=question.prikaz4
   
    if(question.prikaz4===question.odgovor1){
      question.datTacanOdgovor4=true;
      this.tacniOdgovori++
      this.workTest.answers[index].tacan=true
      this.workTest.bodovi+=question.bodovi
      return;
    }else{
      question.datNetacanOdgovor4=true;
      if(question.prikaz2===question.odgovor1){
        question.datTacanOdgovor2=true
        return;
      }
      if(question.prikaz3===question.odgovor1){
        question.datTacanOdgovor3=true
        return;
      }
      if(question.prikaz1===question.odgovor1){
        question.datTacanOdgovor1=true
        return;
      }
    }
  }

  trackByIdx(i) {
    return i;
}

}
