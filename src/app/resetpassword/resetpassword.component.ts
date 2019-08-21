import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//import { UserManagementActions } from '../services/enums';
//import { AuthService } from '../services/auth/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  ngUnsubscribe: Subject<any> = new Subject<any>();
  

  // The user management actoin to be completed
  mode: string;
  // Just a code Firebase uses to prove that
  // this is a real password reset.
  actionCode: string;

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  actionCodeChecked: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: LoginService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        // if we didn't receive any parameters, 
        // we can't do anything
        if (!params) this.router.navigate(['/login']);

        this.mode = params['mode'];
        this.actionCode = params['oobCode'];

        
          
            // Verify the password reset code is valid.
            this.authService.getAuth()
            .verifyPasswordResetCode(this.actionCode)
            .then(email => {
              this.actionCodeChecked = true;
            }).catch(e => {
              // Invalid or expired action code. Ask user to try to
              // reset the password again.
              alert(e);
              this.router.navigate(['/login']);
            });
          
          //  console.log('query parameters are missing');
            //this.router.navigate(['/login']);
          
        
      })
  }

  ngOnDestroy() {
    // End all subscriptions listening to ngUnsubscribe
    // to avoid memory leaks.
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Attempt to confirm the password reset with firebase and
   * navigate user back to home.
   */
  handleResetPassword() {
    if (this.newPassword != this.confirmPassword) {
      alert('New Password and Confirm Password do not match');
      return;
    }
    // Save the new password.
    this.authService.getAuth().confirmPasswordReset(
        this.actionCode,   
        this.newPassword
    )
    .then(resp => {
      // Password reset has been confirmed and new password updated.
      alert('New password has been saved');
      this.router.navigate(['/login']);
    }).catch(e => {
      // Error occurred during confirmation. The code might have
      // expired or the password is too weak.
      alert(e);
    });
  }
}
