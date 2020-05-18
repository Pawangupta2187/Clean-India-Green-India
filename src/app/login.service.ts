import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs';
import {Users} from './users.model';
import {AngularFireDatabase,AngularFireList} from '@angular/fire/database';


import { Component } from '@angular/core';

//import 'rxjs/add/operator/switchMap';






@Injectable({
  providedIn: 'root'

})
export class LoginService {

  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();


  customersRef:AngularFireList<Users>=null;
user_id:string;
  userlist:AngularFireList<any>;
  newUser: any;
      constructor(
      private afAuth: AngularFireAuth,private db: AngularFirestore, private router: Router ,private db2:AngularFireDatabase ) { }
  
    login() {
      console.log('Redirecting to Google login provider');
      this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
    }
  
    logout() {
      this.afAuth.auth.signOut();
      console.log("logout");
    }
    getLoggedInUser() {
      return this.afAuth.authState;
    }
    getUser(){
      return  this.db.collection("Users").snapshotChanges();
      
      //return  this.db.collection('Users').doc(id).valueChanges();
     // return this.db.list(`items/${id}`).snapshotChanges;
    // return this.db.collection('Users').doc(id);

     
     }

    loginwithemail( email: string, password: string) {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
          this.eventAuthError.next(error);
        })
        .then(userCredential => {
          if(userCredential) {
            console.log(userCredential)
            this.router.navigate(['/driver']);
          }
        })
    }
  
    createUser(user) 
    {
      console.log(user);
      this.afAuth.auth.createUserWithEmailAndPassword( user.email, user.password)
        .then( userCredential => {
          this.newUser = user;
         // console.log(userCredential);
          userCredential.user.updateProfile( {
            displayName: user.username
                     });
  
          this.insertUserData(userCredential)
            .then(() => {
              this.router.navigate(['/login']);
            });
        })
        .catch( error => {
          this.eventAuthError.next(error);
          console.log(error)
        });
    }
  
    insertUserData(userCredential: firebase.auth.UserCredential) {
    
      this.user_id=userCredential.user.uid;
      return this.db2.list('users').push({
        userid:userCredential.user.uid,
         displayName:this.newUser.username,
    gender:this.newUser.gender,
    email:this.newUser.email,
    phoneNumber:this.newUser.contact,
    password:this.newUser.password,
    photoUrl:this.newUser.photo_url
      })
      
    }


getdata(uid:string)
{
 console.log(uid)
  /*  query:{
      orderByChild: 'displayName',
      equalTo:'pawan'
  }
  })
 // console.log(this.userlist);
  return this.userlist;*/
  return this.userlist=this.db2.list('/users', ref => 
  ref.orderByChild('userid').equalTo(uid) )

}



getAuth() { 
  return this.afAuth.auth; 
} 

resetPasswordInit(email: string) { 
  return this.afAuth.auth.sendPasswordResetEmail(
    email, 
    { url: 'http://localhost:4200/login' }); 
  } 



  }
