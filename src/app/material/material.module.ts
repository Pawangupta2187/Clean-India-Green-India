import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material'; 
import {MatSidenavModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import {MatDividerModule} from '@angular/material';
import {MatListModule} from '@angular/material';
import {MatGridListModule} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';


const MaterialComponents=[
  MatButtonModule,
  MatSidenavModule,
  MatCardModule,
  MatDividerModule,
  MatListModule,
  MatGridListModule,
  MatIconModule,
   MatDialogModule,
 
 
]

@NgModule({
 
  imports: [MaterialComponents],
  exports:[MaterialComponents]
})
export class MaterialModule { }
