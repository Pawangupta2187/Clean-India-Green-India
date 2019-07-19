import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { DriverComponent } from './driver/driver.component';
const routes: Routes = [
{path: '',redirectTo:'/login',pathMatch:'full'},
{path:'login',component:LoginComponent },
{path:'home',component:HomeComponent },
{path:'register',component:RegistrationComponent},
{path:'driver',component:DriverComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
