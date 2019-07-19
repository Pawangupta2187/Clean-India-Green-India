import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import {Users} from '../users.model';
import {AngularFireAuth} from '@angular/fire/auth';
import { FirebaseListObservable } from '@angular/fire/database-deprecated';
import {AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, tap,switchMap } from 'rxjs/operators';
//import { Subject } from 'rxjs/Subject';


//import { Injectable } from '@angular/core';
//import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase';
//import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { query } from '@angular/animations';
//import { BehaviorSubject } from 'rxjs';
import { ViewChild , ElementRef, NgZone} from '@angular/core';
//import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  @ViewChild('search') public searchElement: ElementRef;

  user: firebase.User;
   userId: string;
 
 userList:any;
 
//googlemap
 public zoom:number=8;
 public latitude:number;
 public longitude:number;

  constructor(private ngzone:NgZone,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private service:LoginService,private afAuth: AngularFireAuth,private db: AngularFireDatabase,private afs:AngularFirestore,private route:Router) {
    

   }

  ngOnInit() {
   this.service.getLoggedInUser()
    .subscribe( user => {
           if(user)
           { this.userId = user.uid;
            this.showdata()
           }
    });


//googlemap
this.setCurrentPosition();
  
  
      this.mapsAPILoader.load().then(
   () => {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:[],componentRestrictions:{'country':'IN'} });
  
     autocomplete.addListener("place_changed", () => {
     this.ngZone.run(() => {
    const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      if(place.geometry === undefined || place.geometry === null ){
        console.log('wrong selection')
       return;
      }
  
     this.latitude=place.geometry.location.lat();
      this.longitude=place.geometry.location.lng();
  
     });
     });
   }
      );
  /* this.afAuth.authState.subscribe(user => {
   if(user) 
 {this.userId = user.uid;


       // this.items=this.db.list(`users/${this.userId}`);
        
    /*   user.providerData.forEach(function (profile){
          console.log("Sign-in provider: " + profile.providerId);
          console.log("  Provider-specific UID: " + profile.uid);
          console.log("  Name: " + profile.displayName);
          console.log("  Email: " + profile.email);
          console.log("  Photo URL: " + profile.photoURL);
          console.log(profile);
        });
             }

   })*/

    
 }
 showdata(){
  var x=this.service.getdata(this.userId);
  x.snapshotChanges().subscribe(item=>{
    this.userList=[];
    item.forEach(element=>{
      var y=element.payload.toJSON();
      y["$key"]=element.key;
      this.userList.push(y as Users);
   //  console.log("data"+item);
    })
  })
 }
 logout()
 {
  this.service.logout()
  this.route.navigate(['/login']);
  
 }
//googlemap
private setCurrentPosition()
  
{
  console.log('done');
  if('geolocation' in navigator)
  {
    navigator.geolocation.getCurrentPosition((position)=>{
      this.latitude=position.coords.latitude;
      this.longitude=position.coords.longitude;
      this.zoom=8;
        })
  }
}
setmarker(event)
{
  this.latitude=event.coords.lat;
  this.longitude=event.coords.lng;
}
}
