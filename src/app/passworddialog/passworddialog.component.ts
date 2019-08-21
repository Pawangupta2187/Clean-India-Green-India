import { Component, OnInit } from '@angular/core';
import {FormBuilder,Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AngularFireAuth} from '@angular/fire/auth';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-passworddialog',
  templateUrl: './passworddialog.component.html',
  styleUrls: ['./passworddialog.component.css']
})
export class PassworddialogComponent implements OnInit {

  constructor(private auth:LoginService,private afAuth:AngularFireAuth,private fb: FormBuilder,  public dialogRef: MatDialogRef<PassworddialogComponent>){}

    resetform=this.fb.group({
           email:['',[Validators.required,Validators.email]]
    });
    onSubmit()
    {
      console.log(this.resetform.value.email);
      this.resetPassword(this.resetform.value.email);
    }

    resetPassword(mail) { 
       this.auth.resetPasswordInit(mail) 
      .then(
        () => alert('A password reset link has been sent to your email address'), 
        (rejectionReason) => alert(rejectionReason)) 
      .catch(e => alert('An error occurred while attempting to reset your password')); 
    }
  ngOnInit() {
  }

}
