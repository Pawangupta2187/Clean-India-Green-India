import { Component, OnInit,Inject } from '@angular/core';
import { ViewChild , ElementRef, NgZone} from '@angular/core';
//import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { NgForm,FormControl,NgControl } from '@angular/forms';
import {NgModule} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TimingComponent } from '../timing/timing.component';
import {AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  @ViewChild('search') public searchElement: ElementRef;

  public zoom:number;
  public latitude:number;
  public longitude:number;
public latB:number=28.628222;
  public lngB:number=76.98715;
  public latlongs:any=[];
  public latlong:any={};
  public poly:boolean=false;
  public edit:boolean=false;
  public timing:string=null;
  public i:number=0;
  public routeid:string;
userId:string;
userList:any;

public stopList:any;
//near route

  editroute()
  {
    this.edit=true;
  }
  stoproute()
  {
    this.edit=false;
    this.storeRoute()
  }
  selectonmap(){
 if(this.edit){
    //this.latitude=event.coords.lat;
    //this.longitude=event.coords.lng;
    this.latlong={
      latitude:this.latB,
      longitude:this.lngB,
      timing:this.timing
    }
    this.latlongs.push(this.latlong);
    console.log(this.latlongs)
  }else
  return;
  
  }
  Undos()
  {
    this.latlongs.splice(-1,1);
    console.log(this.latlongs)
  }
    constructor(private service:LoginService,private db2:AngularFireDatabase,private ngzone:NgZone,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,public dialog: MatDialog) {}
    
    ngOnInit() {
      this.zoom=8;
     // this.latitude=28.589412;
     //this.longitude=77.048247;
      
 this.service.getLoggedInUser()
 .subscribe( user => {
        if(user)
        { this.userId = user.uid;
         console.log(this.userId);
         this.showdata();
      this.showstops(user.uid)
      this.setCurrentPosition();
      
        }
 });
 // this.setCurrentPosition();
  
  
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

    

        }
  
        private setCurrentPosition()
  
        {
         // console.log('done');  //getCurrentPosition
          if('geolocation' in navigator)
          {
            navigator.geolocation.watchPosition((position)=>{
              this.latitude=position.coords.latitude;
              this.longitude=position.coords.longitude;
              this.zoom=8;
              this.addcurlocation(position.coords.latitude,position.coords.longitude);  
              console.log("Location Find again")
                            })
               //this.addcurlocation()  ;          
          }
        }



        openDialog(event): void {
          if(this.edit){
          this.latB=event.coords.lat;
          this.lngB=event.coords.lng;
          console.log('The dialog was open');
          const dialogRef = this.dialog.open(TimingComponent, {
            width: '500px',

            data: {timing: this.timing}
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.timing = result;
            if(this.timing!=null)
            {
            this.selectonmap()
          this.timing=null;
          }
            //console.log(this.timing );
            //console.log(this.latB );
           // console.log(this.lngB );
          });
        }
        }


        storeRoute()
        {if(this.routeid)
          {
            console.log("update")
             this.db2.object('driverstop/'+this.routeid).update({
              userid:this.userId,
             stops:this.latlongs
            })
           //  this.db2.object(`driverstop/${this.routeid}/stops`.update(this.latlongs)
          }
          else{
            console.log("new")
         // this.user_id=userCredential.user.uid;
       //  console.log("store"+this.latlongs)
           this.db2.list('driverstop/').push({
            userid:this.userId,
           stops:this.latlongs
          })

        }
        this.addstartpoint()
        }


        showstops(uid){

          


          var x=this.db2.list('/driverstop', ref => 
          ref.orderByChild('userid').equalTo(uid));//this.service.getdata(this.userId);
          x.snapshotChanges().subscribe(item=>{
        this.stopList=[];
            item.forEach(element=>{
              var y=element.payload.toJSON();
              y["$key"]=element.key;
              this.stopList.push(y);
              this.routeid=element.key;
              console.log("lenght of array="+element.key);
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
             
            //console.log("lenght of array="+this.userList.key);

            })
          })
         
             
          
         }

         addstartpoint(){
           console.log("startpoint")
           console.log(this.latlongs[0].latitude+"_"+this.latlongs[0].longitude)
        return this.db2.object('startpoints/'+this.userId).update({
            lat_long:this.latlongs[0].latitude+"_"+this.latlongs[0].longitude,
            userid:this.userId
         
          })


         }
         addcurlocation(lats:number,longs:number){
          console.log(this.userId)
this.db2.object('current_location/'+this.userId).update({
            latitude:lats,
            longitude:longs,
                 })
           console.log("done")
         }


         showdata(){
           console.log("profile details")
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

       

    
  
  

