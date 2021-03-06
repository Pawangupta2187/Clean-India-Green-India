import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { DriverComponent } from './driver/driver.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import {UpdateprofileComponent} from './updateprofile/updateprofile.component';
import {IndexComponent} from './index/index.component';
const routes: Routes = [
{path: '',redirectTo:'/login',pathMatch:'full'},
{path:'login',component:LoginComponent },
{path:'home',component:HomeComponent },
{path:'register',component:RegistrationComponent},
{path:'driver',component:DriverComponent},
{path:'profile',component:ProfileComponent},
{path:'updateProfile',component:UpdateprofileComponent},
{path:'resetpassword',component:ResetpasswordComponent},
{path:'index',component:IndexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
