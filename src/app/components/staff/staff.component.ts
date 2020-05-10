import { Component, OnInit, ViewChild } from '@angular/core';
import { Staff } from 'src/app/model/staff';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user';
import { MyErrorStateMatcher } from 'src/app/error-validators/MyErrorStateMatcher';
import { StaffService } from 'src/app/services/staff.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forbiddenNameValidator } from 'src/app/error-validators/forbiddenNameValidator';
import { DialogYesNoComponent } from 'src/app/dialogs/dialog-yes-no/dialog-yes-no.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  staffList:Staff[]=[]
  dataSource:any;
  users:User[];
  displayedColumns: string[] = ['id', 'firstName', 'lastName','academic','delete'];
  matcher = new MyErrorStateMatcher();
  showInsertStaff:boolean=false;

  staffForm=this.formBuilder.group({
    id:[""],
    firstName:["",Validators.required],
    lastName:["",Validators.required],
    user:this.formBuilder.group({
      username:["",[Validators.required,forbiddenNameValidator(/admin/)]],
      password:["",Validators.required]
    }),
    academic:this.formBuilder.group({
      id:["",Validators.required],
      name:[""]
    })
  })

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static:true}) table: MatTable<any>;

  constructor(private staffService:StaffService,private formBuilder:FormBuilder,
    public dialog: MatDialog,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.staffService.getAllStaff().subscribe(
      data => {
        console.log("Lista studenata success: "+data)
        this.staffList=data.filter(staff=>{return staff.deleted!=true})
        this.dataSource=new MatTableDataSource(this.staffList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort;
      },
      error=>{console.log("error u listi staff"+error)}
    )
  }

  onSubmitStaff(staffForm:Staff){
    this.setAcademicName(staffForm);
    this.staffService.insertStaffAndUser(staffForm).subscribe(
      data=>{
        console.log("academic vracen sa servera : "+data.academic.deleted)
        this.staffList.push(data);
        this.dataSource.data=this.staffList;
        this.table.renderRows();
        this.onCancel()
        this.snackBar.open(`Staff ${data.firstName} ${data.lastName} is created`,"",{duration:2500})
      },
      error=>{
        console.log("greska pri insertu staff")
        this.snackBar.open(`Staff is not created`,"",{duration:2500})
      }
    )
  }

  onUpdate(staffForm:Staff){
    this.setAcademicName(staffForm)
    this.staffService.updateStaff(staffForm).subscribe(
      data=>{
         //mapiramo niz studenata na item i index i zamenimo odgovarajuci item dobijenim sa servera
         this.staffList.map((staff, i) => {
          if (staff.id == data.id){
             this.staffList[i] = data;
           }
         });
         this.dataSource.data=this.staffList
         this.table.renderRows();
         this.onCancel()
         this.snackBar.open(`Staff ${data.firstName} updated`,"",{duration:2500})
      },
      error=>{
        console.log("greska pri update staff")
        this.snackBar.open(`Staff  is not updated`,"",{duration:2500})
      }
    )
  }

  onAddStaff(){ this.showInsertStaff=true}

  deleteStaffAndUser(staff){
     // let's call our modal window
     const dialogRef = this.dialog.open(DialogYesNoComponent, {
      maxWidth: "450px",
      data:{
        title:"Are you sure?",
        message:`Delete Staff : ${staff.firstName}`
      }
    });
    // listen to response
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if(dialogResult == true){
        this.staffService.deleteStaffAndUser(staff).subscribe(
            data=>{
              this.staffList=this.staffList.filter((s, i) => {
                return s.id!=data.id
              });
              this.dataSource.data=this.staffList
              this.table.renderRows();
              this.staffForm.reset()
              console.log("uspesno brisanje "+data)
              this.snackBar.open(`Staff ${data.firstName} deleted`,"",{duration:2500})
            },
            error=>{
              console.log("neuspesno brisanje ")
              this.snackBar.open(`Staff is not deleted`,"",{duration:2500})
            }
        )
      }else{
        this.snackBar.open(`Canceled`,"",{duration:2500})
      }
    });
  }

  onClear(){this.staffForm.reset()}

  onCancel(){
    this.showInsertStaff=false;
    this.staffForm.reset()
  }

  getRowData(row:any){
    this.staffForm.patchValue(row)
    console.log("prikaz getRowData :"+ this.staffForm.value.firstName+ " academic "+this.staffForm.value.academic.name)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setAcademicName(staffForm){
    if (staffForm.academic.id==1){
      staffForm.academic.name="Profesor"
    }
    if (staffForm.academic.id==2){
      staffForm.academic.name="Asistent"
    }
  }

}
