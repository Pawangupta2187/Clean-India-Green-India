import { Component, OnInit } from '@angular/core';
import {FormBuilder,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../login.service';
import {Users} from '../users.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  authError: any;
  userList:Users[];


  constructor(private fb: FormBuilder,private router:Router,  private service: LoginService) { }

  loginForm=this.fb.group({
    username:['',Validators.required],
    gender:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    contact:['',[Validators.required,Validators.minLength(10)]],
    password:['',[Validators.required,Validators.minLength(8)]],
    photo_url:['']
  });

  
  onSubmit()
  {
  
    this.service.createUser(this.loginForm.value);
    
  }
  ngOnInit() {
    this.service.eventAuthError$.subscribe( data => {
      this.authError = data;
    })
    var x=this.service.getdata('AhJpRYMthZdTbZtcDydYGuLVV4V2');
    x.snapshotChanges().subscribe(item=>{
      this.userList=[];
      item.forEach(element=>{
        var y=element.payload.toJSON();
        y["$key"]=element.key;
        this.userList.push(y as Users);
        console.log(this.userList);
      })
    })

  
    console.log(this.userList);

}
}