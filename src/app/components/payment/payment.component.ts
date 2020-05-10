import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from 'src/app/model/student';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login.service';
import { StudentService } from 'src/app/services/student.service';
import { Payment } from 'src/app/model/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  loggedInStudent:Student
  paymentsList:Payment[]=[]
  dataSource:any
  displayedColumns: string[] = ['position', 'date', 'reason','onePaymentChange'];
  matcher = new MyErrorStateMatcher();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;
  
  constructor(private loginService:LoginService,private studentService:StudentService) { }

  ngOnInit(): void {
    let token = this.loginService.getToken();
    let userId=this.loginService.decodePayload(token).user.id;
    this.studentService.getStudentByUser(userId).subscribe(
      data=>{
        this.loggedInStudent=data
        this.studentService.getPayments(this.loggedInStudent.id).subscribe(
          data=>{
            this.paymentsList=data
            //objekat koji prima listu i omogucuje sort pag i ostale stvari
            this.dataSource=new MatTableDataSource(this.paymentsList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort=this.sort;
          },
          error=>console.log("greska u ucitavanju paymenta")
        )
      },
      error=>console.log("geska pri ucitavanju studenta")
    )
  }

  getTotal(){
    let total=0
    this.paymentsList.map(p=>{
      total+=p.onePaymentChange
    })
    return total
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
