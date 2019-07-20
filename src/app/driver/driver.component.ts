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
      this.latitude=26.2652;
      this.longitude=28.8352;
      /*this.latlongs=[
        {latitude:this.latitude,longitude:this.longitude},
        {latitude:this.latB,longitude:this.lngB}
        
      ];
      
  */
 this.service.getLoggedInUser()
 .subscribe( user => {
        if(user)
        { this.userId = user.uid;
         
      this.showdata(user.uid)
      
        }
 });
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

        }
  
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
            return this.db2.object('driverstop/'+this.routeid).update({
              userid:this.userId,
             stops:this.latlongs
            })
           //  this.db2.object(`driverstop/${this.routeid}/stops`.update(this.latlongs)
          }else{console.log("new")
         // this.user_id=userCredential.user.uid;
       //  console.log("store"+this.latlongs)
          return this.db2.list('driverstop/').push({
            userid:this.userId,
           stops:this.latlongs
          })

        }
        }


        showdata(uid){

          


          var x=this.db2.list('/driverstop', ref => 
          ref.orderByChild('userid').equalTo(uid));//this.service.getdata(this.userId);
          x.snapshotChanges().subscribe(item=>{
        this.userList=[];
            item.forEach(element=>{
              var y=element.payload.toJSON();
              y["$key"]=element.key;
              this.userList.push(y);
              this.routeid=element.key;
              console.log("lenght of array="+element.key);
              while(this.userList[0].stops[this.i].latitude)
              {
            
              // console.log("lenght of array="+this.userList[0].stops[this.i].latitude);
               this.latlong={
                latitude:this.userList[0].stops[this.i].latitude,
                longitude:this.userList[0].stops[this.i].longitude,
                timing:this.userList[0].stops[this.i].timing
              }
              this.latlongs.push(this.latlong);
               this.i++;
              }
             
            //console.log("lenght of array="+this.userList.key);

            })
          })
         
             
          
         }

      }

       

    
  
  

