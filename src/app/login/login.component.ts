import { Component, OnInit } from '@angular/core';
import {FormBuilder,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../login.service';
import {MatDialog} from '@angular/material/dialog';
import { PassworddialogComponent } from '../passworddialog/passworddialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: firebase.User;
  authError: any;
  public email:string;

  constructor(private fb: FormBuilder,private router:Router,  private service: LoginService,private dialog:MatDialog){}

loginForm=this.fb.group({
  userMail:['',Validators.required],
  password:['',[Validators.required,Validators.minLength(8)]]
})  ;
ngOnInit() {
  this.service.getLoggedInUser()
    .subscribe( user => {
      console.log( user );
            this.user = user;
    }); 

    this.service.eventAuthError$.subscribe( data => {
      this.authError = data;
    }); 
    
    
}

logingoogle() {
  console.log('Login...');
  this.service.login(); 
}

logout() {
  this.service.logout();
}

onsubmit(detail) {
  this.service.loginwithemail(detail.value.userMail,detail.value.password);
}


openDialog(): void {
    console.log('The dialog was open');
  const dialogRef = this.dialog.open(PassworddialogComponent, {
    width: '500px',
    data: {email: this.email}


  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.email = result;
    console.log(result);
    
});
}

} 
