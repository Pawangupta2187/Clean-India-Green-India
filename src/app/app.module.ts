import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';




import {CommonModule} from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule} from  '@angular/fire/auth';
import { RegistrationComponent } from './registration/registration.component';
//import {UsersService} from './shared/users.service';
import {DriverComponent} from './driver/driver.component';
import { TimingComponent } from './timing/timing.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { PassworddialogComponent } from './passworddialog/passworddialog.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationComponent,
    DriverComponent,
    TimingComponent,
    ProfileComponent,
    ResetpasswordComponent,
    PassworddialogComponent,
    UpdateprofileComponent 
  ],
  entryComponents:[TimingComponent,PassworddialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyCWST3YvXmayprzAMdHiJ9GPADsGrqtogM',
      libraries:['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]  
})
export class AppModule { }
