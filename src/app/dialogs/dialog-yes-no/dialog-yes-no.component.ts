import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Student } from 'src/app/model/student';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-dialog-yes-no',
  templateUrl: './dialog-yes-no.component.html',
  styleUrls: ['./dialog-yes-no.component.css']
})
export class DialogYesNoComponent implements OnInit {

  dialogData: DialogData;
  title:string;
  message:string;

  constructor(public dialogRef: MatDialogRef<DialogYesNoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // Close the dialog, return true as result of observable
    this.dialogRef.close(true);
}

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
}

}
