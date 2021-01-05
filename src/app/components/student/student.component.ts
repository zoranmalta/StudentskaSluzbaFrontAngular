import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student';
import { User } from 'src/app/model/user';
import { MatTableDataSource ,MatTable} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder,Validators} from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { forbiddenNameValidator } from 'src/app/error-validators/forbiddenNameValidator';
import { StudentRowData } from 'src/app/model/studentRowData';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Payment } from 'src/app/model/payment';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
 
})
export class StudentComponent implements OnInit {

  students:Student[]=[]
  dataSource:any;
  users:User[];
  displayedColumns: string[] = ['cardNumber','firstName', 'lastName','address', 'accountBalance','email','delete','payments'];
  matcher = new MyErrorStateMatcher();
  showInsertStudent:boolean=false;
  showInsertStudentPayment:boolean=false;
  selectedStudent:Student

  studentForm=this.formBuilder.group({
    id:[""],
    cardNumber:["",Validators.required],
    firstName:["",Validators.required],
    lastName:["",Validators.required],
    address:["",Validators.required],
    accountBalance:[0],
    email:["",[Validators.required,Validators.email]],
    userForm:this.formBuilder.group({
      username:["",[Validators.required,forbiddenNameValidator(/admin/)]],
      password:["",Validators.required]
    })
  })

  paymentForm=this.formBuilder.group({
    id:[""],
    onePaymentChange:["",[Validators.required,Validators.max(1000000),Validators.min(0),Validators.pattern('[0-9]*')]]
    
  })

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;

  constructor(private studentService:StudentService,private formBuilder:FormBuilder,
    public dialog: MatDialog,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.studentService.getAllStudents().subscribe(
      data=>{
        console.log("Lista studenata success: "+data)
        this.students=data.filter(studnet=>{return studnet.deleted!=true})
        this.dataSource=new MatTableDataSource(this.students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort;
      },
      error=>console.log("Error u listi studenata :"+error)
    )
  }
  
  addPayment(student:Student){
    this.selectedStudent=student
    this.showInsertStudent=false
    this.showInsertStudentPayment=true
  }
  onSubmitPayment(paymentForm){
    let payment=new Payment()
    payment.onePaymentChange=paymentForm.onePaymentChange
    payment.student=this.selectedStudent
    payment.reason="Uplata sredstava"
    this.studentService.insertPayment(payment).subscribe(
     data=>{
       this.students.forEach(
         s=>{
           if(s.id==data.student.id){
             s.accountBalance+=data.onePaymentChange
           }
         }
       )

       console.log("uspesan payment")
       this.snackBar.open("Payment created","",{duration:3000});
     } ,
     error=>{
       console.log("payment faild")
       this.snackBar.open(" Payment faild","",{duration:3000})
     }
    )
    this.onCancelPayment()
  }

  onCancelPayment(){
    this.showInsertStudentPayment=false;
    this.paymentForm.reset()
  }
  onClearPayment(){
    this.paymentForm.reset()
  }

  //treba da posalje podatke za usera i studenta koji je ista osoba na server i vrati studenta
  //kojeg ubacujemo u tabelu(dataSource)
  onSubmitStudent(row:any){
    row.accountBalance=0
    this.studentService.insertStudentAndUser(row).subscribe(
      data=>{
        this.students.push(data);
        this.dataSource.data=this.students
        this.table.renderRows();
        this.dataSource.data=this.students
        this.table.renderRows();
        console.log("Lista studenata posle insserta"+this.dataSource.data.length+
                    " broj objekata u nizu "+this.dataSource.data)
        this.onCancel()
        this.snackBar.open(`Student ${data.cardNumber} created`,"",{duration:2500})
      },
      error=>{
        console.log("greska pri insertu studenta")
        this.snackBar.open(`Student is not created`,"",{duration:2500})
      }
    )
  }
  onUpdate(row:any){
    this.studentService.updateStudent(row).subscribe(
      data=>{
        //mapiramo niz studenata na item i index i zamenimo odgovarajuci item dobijenim sa servera
        this.students.map((student, i) => {
          if (student.id == data.id){
             this.students[i] = data;
           }
         });
         this.dataSource.data=this.students
         this.table.renderRows();
         this.onCancel()
         this.snackBar.open(`Student ${data.cardNumber} updated`,"",{duration:2500})
      },
      error=>{
        console.log("greska pri update studenta")
        this.snackBar.open(`Student  is not updated`,"",{duration:2500})
      }
    )
  }
  deleteStudentAndUser(student:Student){
    // let's call our modal window
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Delete Student Card Number: ${student.cardNumber}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.studentService.deleteStudent(student).subscribe(
            data=>{
              this.students=this.students.filter((student, i) => {
                return student.id!=data.id
              });
              this.dataSource.data=this.students
              this.table.renderRows();
              this.studentForm.reset()
              console.log("uspesno brisanje "+data)
              this.snackBar.open(`Student ${data.cardNumber} deleted`,"",{duration:2500})
            },
            error=>{
              console.log("neuspesno brisanje ")
              this.snackBar.open(`Student is not deleted`,"",{duration:2500})
            }
        )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }

  onAddStudent(){
    this.showInsertStudentPayment=false
    this.showInsertStudent=true;
  }
  onCancel(){
    this.showInsertStudent=false;
    this.studentForm.reset()
  }
  onClear(){
    this.studentForm.reset()
  }
   //event uzima element sa htmla i njegovu vrednost koju prosledjuje filteru
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRowData(row:Student){
    // patchValue lepi dostupne podatke na formu
    this.studentForm.patchValue(row)
  }

}
