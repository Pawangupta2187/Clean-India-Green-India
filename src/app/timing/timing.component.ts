import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-timing',
  templateUrl: './timing.component.html',
  styleUrls: ['./timing.component.css']
})
export class TimingComponent implements OnInit {

  
  ngOnInit() {
  }
  constructor(
    public dialogRef: MatDialogRef<TimingComponent>){}

  onNoClick(): void {
    this.dialogRef.close();
  }


}
