import { Component, OnInit } from '@angular/core';
import {FormBuilder,Validators } from '@angular/forms';


import { AngularFireStorage } from '@angular/fire/storage';

import { finalize } from "rxjs/operators";
import {Router} from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent implements OnInit {
  imgSrc:string="/assets/Capture.JPG";
  selectedImage:any=null;
  isSubmitted:boolean;

 //login user
  userId: string;
  userList:any;

  constructor(private fb: FormBuilder,private storage: AngularFireStorage,private service:LoginService) { }
  updateForm=this.fb.group({
    image_url:['',Validators.required],
   username:['',Validators.required],
    gender:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    contact:['',[Validators.required,Validators.minLength(10)]],
      });


  ngOnInit() {
    this.service.getLoggedInUser()
    .subscribe( user => {
           if(user)
           { this.userId = user.uid;
            this.showdata()
           
           }
    });
  }

  showdata(){
    var x=this.service.getdata(this.userId);
  x.snapshotChanges().subscribe(item=>{
    this.userList=[];
    item.forEach(element=>{
      var y=element.payload.toJSON();
      y["$key"]=element.key;
      this.userList.push(y)
   //  console.log("data"+item);
   console.log("afetr val"+this.userList[0].gender)
   this.updateForm.patchValue({
   username:this.userList[0].displayName,
   gender:this.userList[0].gender,
   contact:this.userList[0].phoneNumber,
   email:this.userList[0].email,
 });
 this.updateForm.valueChanges.subscribe(  
  value=> {  
     console.log(JSON.stringify(value));  
  }  
);
   
        })
    })
   }


showPreview(event:any)
{
  console.log("preview");
  if(event.target.files && event.target.files[0])
  {
    const reader= new FileReader();
    reader.onload= (e:any) =>this.imgSrc=e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImage=event.target.files[0];
  }
  else{
    this.imgSrc='/assets/Capture.JPG';
    this.selectedImage=null;
   

  }
  }



  onSubmit(formValue) {

    this.isSubmitted = true;

    if (this.updateForm.valid) {

      var filePath = `userprofile/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;

      const fileRef = this.storage.ref(filePath);

      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(

        finalize(() => {

          fileRef.getDownloadURL().subscribe((url) => {

            formValue['image_url'] = url;
            console.log(url);

           // this.service.insertImageDetails(formValue);

           // this.resetForm();

          })

        })

      ).subscribe();

    }

  }
  showupdate()
{
  console.log(this.updateForm);
}

}
