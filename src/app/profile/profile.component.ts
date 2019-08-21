import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string;
 
  userList:any;
  constructor(private service:LoginService) { }

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
      this.userList.push(y);
   //  console.log("data"+item);
        })
    })
   }

}
