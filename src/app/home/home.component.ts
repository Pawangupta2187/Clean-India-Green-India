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
 //near routeid
 public nearroute:string;
public latx=28.627831151589408;
public lngx=76.98805052700698;



//driver
public driverList:any;
public stopList:any;
//driver location
public driverlat:number;
public driverlong:number;
public driverposition:any=[];
//googlemap
 public zoom:number=4;
 public latitude:number;
 public longitude:number;
 public i:number=0;
 public latlongs:any=[];
 public latlong:any={};
 public routeid:string;
 public strokecolors=['green','red','blue','black','yellow'];
 public strokecolor:string;
 public color:number=-1;
 public flatlongs:any=[[]];
 public index:number=0;

  constructor(private db2:AngularFireDatabase,private ngzone:NgZone,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,private service:LoginService,private afAuth: AngularFireAuth,private db: AngularFireDatabase,private afs:AngularFirestore,private route:Router) {
    

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
  
  //autocomplete
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
{ //console.log("array remove "+this.latlongs)
//console.log("array  before remove "+this.latlongs)
this.latitude=event.coords.lat;
this.longitude=event.coords.lng;
  this.latlongs=[];
  this.driverList=[];
  this.driverlat=0;
  this.driverlong=0;
 // console.log("array remove "+this.latlongs)
 
 
}



shownearroute()
{
 // console.log("near routes detai")
 this.color=0;
 this.latlongs=[];
 this.driverList=[];
 this.driverlat=0;
 this.driverlong=0;
 this.flatlongs=[];
 this.driverposition=[];
 var x=this.db2.list('/startpoints', ref => 
 ref.orderByChild('lat_long').startAt((this.latitude-.02)+"_"+(this.longitude-0.02)).endAt((this.latitude+0.02)+"_"+(this.longitude+0.02))); //equalTo(this.latx+"_"+this.lngx));//this.service.getdata(this.userId);
 x.snapshotChanges().subscribe(item=>{
this.driverList=[];
   item.forEach(element=>{
     var y=element.payload.toJSON();
     y["$key"]=element.key;
   this.driverList.push(y);
     this.nearroute=element.key;
     this.getdriverlocation(this.nearroute);
   
       this.showroute(this.nearroute)
      // console.log("location"+this.driverposition);
    
   })
 })



}



showroute(uid){

     this.color++;
     this.strokecolor=this.strokecolors[this.color];     

//console.log(this.latlongs.length)
    // this.latlongs.length=0;


     //console.log("show route"+this.latlongs)
  var x=this.db2.list('/driverstop', ref => 
  ref.orderByChild('userid').equalTo(uid));//this.service.getdata(this.userId);
  x.snapshotChanges().subscribe(item=>{
this.stopList=[];


    item.forEach(element=>{
      var y=element.payload.toJSON();
      y["$key"]=element.key;
      this.stopList.push(y);
      this.routeid=element.key;
    
    
     // console.log("lenght of array2="+this.flatlongs.length+"");
     this.i=0;
   this.stopList.forEach(x=>{
     
     while(x.stops[this.i]!=undefined)
     {
      console.log(x.stops[this.i]);
      this.latlong={
        latitude:x.stops[this.i].latitude,
        longitude:x.stops[this.i].longitude,
        timing:x.stops[this.i].timing
      }
      this.latlongs.push(this.latlong);
     // this.flatlongs[this.index][this.i]=this.latlong;
     this.i++;
      }

      
    
   })
    this.flatlongs[this.index]=this.latlongs;
    this.index++;
    /*console.log(this.latlongs.length);
    console.log(this.flatlongs.length);
    console.log(this.flatlongs[0][0].latitude);
    console.log(this.flatlongs);
    console.log(this.flatlongs[0].length);
  
*/

     /* this.i=0;
      
      while(this.userList[0].stops[this.i].latitude!=undefined)
      {
    
            this.latlong={
        latitude:this.userList[0].stops[this.i].latitude,
        longitude:this.userList[0].stops[this.i].longitude,
        timing:this.userList[0].stops[this.i].timing
      }
      this.latlongs.push(this.latlong);
      console.log(this.userList[0].stops[this.i].latitude)
      console.log(this.latlongs.length)
      console.log(this.i);
       this.i++;
   
      }*/
     
    })
    
  })
 
 
 
 }
 getdriverlocation(id:string)
 {
  var x=this.db2.list('/current_location/'+id);
    x.snapshotChanges().subscribe(item=>{
     // this.driverposition.push(item);
      item.forEach(element=>{
      var y=element.payload.toJSON();
     //y["$key"]=element.key;
          this.driverposition.push(y);
      console.log("location"+this.driverposition);
      
    })
    console.log("location"+this.driverposition.length);
    this.driverlat=this.driverposition[0];
    this.driverlong=this.driverposition[1];
  })
  
 }
}
