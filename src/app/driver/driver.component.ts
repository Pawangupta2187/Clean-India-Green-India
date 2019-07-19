import { Component, OnInit,Inject } from '@angular/core';
import { ViewChild , ElementRef, NgZone} from '@angular/core';
//import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { NgForm,FormControl,NgControl } from '@angular/forms';
import {NgModule} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TimingComponent } from '../timing/timing.component';


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

  editroute()
  {
    this.edit=true;
  }
  stoproute()
  {
    this.edit=false;
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
    constructor(private ngzone:NgZone,private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,public dialog: MatDialog) {}
    
    ngOnInit() {
      this.zoom=8;
      this.latitude=26.2652;
      this.longitude=28.8352;
      /*this.latlongs=[
        {latitude:this.latitude,longitude:this.longitude},
        {latitude:this.latB,longitude:this.lngB}
        
      ];
      
  */
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
      }

       

    
  
  

