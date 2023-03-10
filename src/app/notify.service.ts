import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
//import { getMessaging } from "firebase/messaging";
//import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { take } from 'rxjs/operators';

import { 
  Messaging, onMessage, getMessaging, 
  getToken, deleteToken, GetTokenOptions
} from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  //private messageSource = new Subject();
  currentMessage:any = new BehaviorSubject(null);

  constructor(
    private auth:AuthService,
    private afMessaging: Messaging
    ){
      // this.angularFireMessaging.messages.subscribe((_messaging) => {
      //   //_messaging.onMessage = _messaging.onMessage.bind(_messaging);
      //   //_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      // })

      // this.angularFireMessaging.messages.subscribe(
      //   (_messaging: AngularFireMessaging) => {
      //   _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      //   _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      // })
      
    }

    listen() {
      const messaging = getMessaging();
      getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });

      // this.angularFireMessaging.messages.subscribe((message) => { 
      //   console.log(message); 
      // });
    }

    requestPermission() {
      // this.angularFireMessaging.requestToken.subscribe((token) => {
      //   console.log(token);
      // },(err) => {
      //   console.error('Unable to get permission to notify.', err);
      // });
    }

    receiveMessage() {
      // this.angularFireMessaging.messages.subscribe((payload) => {
      // console.log("new message received. ", payload);
      // this.currentMessage.next(payload);
      // })
    }

  // Listen for token refresh
  monitorRefresh(user:any) {
    // this.angularFireMessaging.tokenChanges.subscribe(token => {
    //   console.log('Token refreshed.', token);
    //   // this.messaging.getToken.pipe(take(1)).subscribe(token => {
    //   //   console.log('older token',token)
    //      this.saveToken(user, token)
    //   // })
    // });
  }

  // save the permission token in firestore
  private saveToken(user:any, token:any): void {
    // const currentTokens = user.fcmTokens || { }
    // console.log(currentTokens, token)

    // // If token does not exist in firestore, update db
    // if (!currentTokens[token]) {
    //   //const userRef = this.auth.notifySaveToken(user.uid)
    //   //const tokens = { ...currentTokens, [token]: true }
    //   //userRef.update({ fcmTokens: tokens })
    // }
  }
/*
    get messaging(){
      return this.afM;
    }

  
  // get permission to send messages
  getPermission(user:any) {
    this.messaging.requestPermission.pipe(take(1)).subscribe(() => {
      console.log('Notification permission granted.');
      this.messaging.getToken.pipe(take(1)).subscribe(token => {
        console.log('created new token',token)
        this.saveToken(user, token)
      })
    })
  }


  // Listen for token refresh
  monitorRefresh(user:any) {
    this.messaging.onTokenRefresh(() => {
      console.log('Token refreshed.');
      this.messaging.getToken.pipe(take(1)).subscribe(token => {
        console.log('older token',token)
        this.saveToken(user, token)
      })
    });
  }

  // used to show message when app is open
  receiveMessages() {
    this.messaging.onMessage(payload => {
     console.log('Message received. ', payload);
     this.messageSource.next(payload)
   });
  }

  // save the permission token in firestore
  private saveToken(user:any, token:any): void {
      const currentTokens = user.fcmTokens || { }
      //console.log(currentTokens, token)

      // If token does not exist in firestore, update db
      if (!currentTokens[token]) {
        //const userRef = this.auth.notifySaveToken(user.uid)
        //const tokens = { ...currentTokens, [token]: true }
        //userRef.update({ fcmTokens: tokens })
      }
  }
*/



}
