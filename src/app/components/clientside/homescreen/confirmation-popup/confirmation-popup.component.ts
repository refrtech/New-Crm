import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss'],
})
export class ConfirmationPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}



  close(values:boolean) {
    this.dialogRef.close({ success: false });
  }
}
