import { Injectable } from '@angular/core';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { EMPTY, Observable, of, switchMap, take } from 'rxjs';
import { ResourceService } from './resource.service';

import { Hype, Locate, Product, Shop, User } from './universal.model';

//import app from 'firebase/compat/app';
//import { WindowService } from './window.service';

import {
  Auth,
  authState,
  fetchSignInMethodsForEmail,
  linkWithPhoneNumber,
  updateEmail,
  updatePassword,
  updateProfile,
  signInWithEmailAndPassword,
  UserCredential,
  updatePhoneNumber,
  /*User*/ PhoneAuthCredential,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithPopup,
  linkWithPopup,
  RecaptchaVerifier,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  linkWithCredential,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  collectionGroup,
  doc,
  getDoc,
  docData,
  setDoc,
  updateDoc,
  addDoc,
  query,
  limit,
  orderBy,
  where,
  FieldValue,
  increment,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  DocumentReference,
  CollectionReference,
  onSnapshot,
} from '@angular/fire/firestore';
import { Storage, ref, uploadString } from '@angular/fire/storage';

//import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { getDownloadURL } from '@firebase/storage';
import { HttpClient } from '@angular/common/http';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any> = this.getLogUSER();
  allowLog = false;

  lock = true;
  step = 0;
  stepDisable = false;
  windowRef: any;
  confirmationResult: any;
  verificationId: string = '';
  verificationReset: any;

  ManMade = '';
  constructor(
    //public afAuth: AngularFireAuth,
    public afAuth: Auth,
    //private afs: AngularFirestore,
    private firestore: Firestore,
    private fireStorage: Storage,
    private http: HttpClient,
    public resource: ResourceService,
    private win: WindowService //private fb: Facebook //private gP: GooglePlus //private googlePlus: GooglePlus
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    //this.user$ = this.getLogUSER();
  }

  get getServerTimestamp() {
    return serverTimestamp;
  }

  setupReCapca() {
    console.log('!11111111');

    //this.afAuth.settings.appVerificationDisabledForTesting = true;

    //AuthSettings()
    //appVerificationDisabledForTesting(true) //= true;
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      this.afAuth
    );
    console.log('!11111111');

    // new RecaptchaVerifier(/*'sign-in-button', {
    //   'size': 'invisible',
    //   'callback': (response:any) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     //onSignInSubmit();
    //     return response;
    //   }
    // }, this.afAuth */
    // 'recaptcha-container', { 'size': 'invisible'}, this.afAuth  )
    // //RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });

    this.windowRef.recaptchaVerifier.render();
  }

  getFirestoreDocument(docX: string, idX: string) {
    try {
      const itemDoc = doc(this.firestore, `${docX}`, `${idX}`);
      return docData(itemDoc);
    } catch (err) {
      return of();
    }
  }

  getFirestoreCollection() {}

  // AUTH SYSTEM
  private getLogUSER() {
    //this.allowLog = false;
    //return this.afAuth.authState.pipe(switchMap(user => {
    return authState(this.afAuth).pipe(
      switchMap((user) => {
        if (!user) {
          this.allowLog = true;
          return of(null);
        } else {
          if (!user.phoneNumber && !user.emailVerified) {
            this.allowLog = true;
            return of(null);
          } else {
            this.allowLog = true;
            //return of({id:user.uid});
            //return this.afs.doc<User>(`${this.resource.env.db.users}/${user.uid}`).valueChanges();
            // return this.afs.doc<User>(`${this.resource.env.db.users}/${user.uid}`).valueChanges();
            //return doc<User>(`${this.resource.env.db.users}/${user.uid}`).valueChanges();
            //return getDoc() (`${this.resource.env.db.users}/${user.uid}`);

            // const itemDoc = doc(this.firestore, `${this.resource.env.db.users}`, `${user.uid}`);
            // return docData(itemDoc);
            return this.getFirestoreDocument(
              this.resource.env.db.users,
              user.uid
            );
          }
        }
      })
    );
  }

  async step0_userForward(phone: string, byMe: boolean) {
    // check if user exist redirect login else redirect 1
    this.stepDisable = true;
    // CHECK FOR USER
    let email = phone + '@' + 'refr.club';
    const fetchSignMethodEmail = await fetchSignInMethodsForEmail(
      this.afAuth,
      email
    );
    //const fetchSignMethodEmail = await this.afAuth.fetchSignInMethodsForEmail( email );

    if (fetchSignMethodEmail?.length > 0) {
      // USER PHONE@EMAIL.com EXIST
      //WORK NEEDED
      if (fetchSignMethodEmail.includes('password')) {
        //if(!byMe){
        //this.step = 3;//REDIRECT LOGIN WITH PASSWORD
        //return {"success":true}
        //}else{
        return { success: true, exist: true };
        //}
      } else {
        // CHECK IF SIGN IN INCLUDES PHONE
        return { success: false, info: '401' };
      }
    } else {
      // NO SUCH USER > SIGN UP GO STEP 1
      //if(!byMe){
      //this.step = 1;
      //return {"success":true}
      //}else{
      return { success: true, exist: false };
      //}
    }
  }

  async step0_socialForward(uid: string, email: string) {
    // check if user exist redirect login else redirect 1
    this.stepDisable = true;
    // const userRef: AngularFirestoreDocument<User> = this.afs.doc(`${this.resource.env.db.users}/${uid}`);
    // return await userRef.get();
    //const userRef = this.getFirestoreDocument(this.resource.env.db.users, uid);
    //return await userRef;

    //REMEMBER FIX
    //return await this.getFirestoreDocument(this.resource.env.db.users, uid);
    const docRef = doc(
      this.firestore,
      `${this.resource.env.db.users}`,
      `${uid}`
    );
    return await getDoc(docRef);

    // let responce = null;
    // let x = await userRef.get().pipe(take(1)).subscribe(ref => {
    //   if(!ref){
    //     responce = {"success":false, info:"401"};
    //     return responce;
    //   }else{
    //     if(!ref.exists){
    //       // create new user
    //       responce = {"success":true, exists: ref.exists}
    //       return responce;
    //     }else{
    //       // sign current user
    //       responce = {"success":true, exists: ref.exists}
    //       return responce;
    //       //socialCreate
    //     }
    //   }
    // });
    // return x ? responce: "x";
  }
  /*
    async step1_newUSER(phone:string,
      //password:string, name:string,
      //iso:string, coin:string
      ){//CREATE USER WITH artificial EMAIL & PASSWORD
      this.stepDisable = true;
      const email = phone + "@" + "refr.club";
      const fetchSignMethod = await this.afAuth.fetchSignInMethodsForEmail(email);
      if(fetchSignMethod?.length > 0){// USER PHONE@EMAIL.com EXIST
        return {success:false,info:"401"}
      }else{
        return {success:true, phone:phone}


        / *
        const credential = await this.afAuth.createUserWithEmailAndPassword(email,password);
        // CREATE USER DOC TO FIRESTORE
        const storeData = await this.updateUserData("phone", credential.user, phone, name, iso, coin, "", false ).then(() => {
          credential.user?.updateProfile({ displayName: name })
          return { success:true }
        }).catch(err =>{ return { success:false,info:"issue: " + err } });
        // CREATE USER DOC TO FIRESTORE
        if(!storeData.success){
          return storeData
        }else{
          // SEND OTP
          return {success:true, phone:phone}
        }
        * /
      }
    }
  */
  // async stepAdd_USERS_PHONE(phone:string, //password:string,
  //   iso:string, coin:string){//ADD PHONE WITH artificial EMAIL & PASSWORD
  // }

  /*
    async stepAdd_USERS_PHONE(phone:string
      //, password:string, iso:string, coin:string
    ){//CREATE USER WITH artificial EMAIL & PASSWORD
      this.stepDisable = true;
      const email = phone + "@" + "refr.club";
      const fetchSignMethod = await this.afAuth.fetchSignInMethodsForEmail(email);
      const appVerifier = this.windowRef.recaptchaVerifier;

      if(fetchSignMethod?.length > 0){// USER PHONE@EMAIL.com EXIST
        return {"success":false,info:"401"}
      }else{
        const credential = await this.afAuth.currentUser;
        if(!credential){
          return {"success":false,info:"issue: No user logged"}
        }else{
          return await credential?.linkWithPhoneNumber(phone, appVerifier).then(result =>{
            this.verificationId = result.verificationId;
            return {"success":true, info:""}
          }).catch(err => {
            return {"success":false,info:"issue: " + err}
          })
        }
        //createUserWithEmailAndPassword(email,password);
        // const credential = await this.afAuth.createUserWithEmailAndPassword(email,password);
        // // CREATE USER DOC TO FIRESTORE
        // const storeData = await this.updateUserData("phone", credential.user, phone, name, iso, coin, "", false ).then(() => {
        //   credential.user?.updateProfile({ displayName: name })
        //   return { success:true }
        // }).catch(err =>{ return { success:false,info:"issue: " + err } });
        // // CREATE USER DOC TO FIRESTORE
        // if(!storeData.success){
        //   return storeData
        // }else{
        //   // SEND OTP
        //   return {success:true, phone:phone}
        // }
      }
    }
  */

  async addPhoneWithOTP(phone: string) {
    this.stepDisable = true;
    const appVerifier = this.windowRef.recaptchaVerifier;
    if (!appVerifier) {
      return { success: false, info: 'recaptcha did not process properly.' };
    } else {
      const currentUser = await this.afAuth.currentUser;
      if (!currentUser) {
        return { success: false, info: 'Sms not sent' };
      } else {
        //return currentUser.linkWithPhoneNumber(phone, appVerifier).then(confirmationResult => {
        return linkWithPhoneNumber(currentUser, phone, appVerifier)
          .then((confirmationResult) => {
            this.confirmationResult = confirmationResult;
            this.verificationId = confirmationResult.verificationId;
            return { success: true, info: '' };
          })
          .catch((error) => {
            return { success: false, info: error };
          });
      }
    }
  }

  async verifyPhoneWithOTPX(phone: string, logged: boolean) {
    this.stepDisable = true;
    const appVerifier = this.windowRef.recaptchaVerifier;
    if (!appVerifier) {
      return { success: false, info: 'recaptcha did not process properly.' };
    } else {
      //return app.auth().signInWithPhoneNumber(phone, appVerifier)
      return signInWithPhoneNumber(this.afAuth, phone, appVerifier)
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult;
          this.verificationId = confirmationResult.verificationId;
          //confirmationResult.confirm("").then(ref => {
          //let email = phone + "@" + "refr.club";
          //ref.user?.updateEmail(email)
          //ref.user?.updatePassword("")
          //ref.user?.updateProfile({displayName:"", photoURL:""})
          //})
          return { success: true, info: '' };
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
        })
        .catch((error) => {
          return { success: false, info: error };
        });
    }
  }

  async verifyPhoneWithOTP(phone: string, logged: boolean) {
    this.stepDisable = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

    if (!logged) {
      const provider = new PhoneAuthProvider(this.afAuth);
      return await provider
        .verifyPhoneNumber(phone, appVerifier)
        .then((verificationId) => {
          this.verificationId = verificationId;
          this.step = 2;
          return { success: true, info: '' };
        })
        .catch((err) => {
          return { success: false, info: 'issue: ' + err };
        });
    } else {
      const credential = await this.afAuth.currentUser;
      if (!credential) {
        return { success: false, info: 'issue: No user logged' };
      } else {
        //return await credential?.linkWithPhoneNumber(phone, appVerifier).then(result =>{
        return await linkWithPhoneNumber(credential, phone, appVerifier)
          .then((result) => {
            this.verificationId = result.verificationId;
            return { success: true, info: '' };
          })
          .catch((err) => {
            return { success: false, info: 'issue: ' + err };
          });
      }
    }
  }

  private updateUserData(
    medium: string,
    user: any,
    phone: string,
    name: string,
    iso: string,
    coin: string,
    email: string,
    emailV: boolean
  ) {
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.users}/${user.uid}`
    );
    //const userRef: AngularFirestoreDocument<User> = doc(`${this.resource.env.db.users}`, `${user.uid}`);
    //const userRef: AngularFirestoreDocument<User> = setDoc(`${this.resource.env.db.users}/${user.uid}`);
    let newTimestamp = this.getServerTimestamp();
    let status = "Hey there! I'm using " + this.resource.env.brand + '.';

    let look: string[] = []; //this.resource.getLOOKUP( name.toLowerCase() );
    //look = look.filter((elem, index, self) => { return index === self.indexOf(elem); })
    //look = look.filter((elem) => { return elem.length > 2; })

    // let over: string[] = [];
    // if(coin == "INR"){over = ["UPI"]}
    // if(coin == "ISR"){over = ["Paypal"]}
    // if(coin == "USA"){over = ["Paypal", "Stripe"]}
    // if(coin == "GBR"){over = ["Paypal", "Stripe"]}

    const data: User = {
      uid: user.uid,
      name: name,
      display: '',
      phone: phone,
      iso: iso,
      coin: coin,
      email: email,
      emailV: emailV,
      emails: [],

      soIG: '',
      soYT: '',
      soTW: '',
      soWA: '',
      storeLoc: [],
      storeCam: [],
      sin: newTimestamp,
      upd: newTimestamp,
      log: newTimestamp,
      ban: false,
      note: [
        {
          info:
            'Hi ' + name.split(' ') + ' welcome to ' + this.resource.env.brand,
          by: this.resource.env.brand,
          sin: Date.now(),
          URL: '',
        },
      ],

      acBalC: 0,
      acBalV: 0,
      acBalP: 0,
      acBalCr: 0,
      acBalVr: 0,
      acBalH: 0,
      axess: [medium],
      /*
      check: false,
      email: user.email, username:"",
      info:status, url:"",
      cR: 0, cA: 0, cL: [],
      pANX: [], pKIN: [], pFTR: [], pSALE: [],
      typ:1, sex:0, stat:"",
      sub:[],
      pay:{ now:0, out:0, cut:18, exit:false, over:over },
      chat:[],look:look, stay:[]
      */
    };
    if (emailV) {
      data.emails.push(email);
    }
    //ALLOW NOTIFICATION SEND
    //ALLOW NOTIFICATION SEND
    //return userRef.set(data, { merge: true });
    return setDoc(userRef, data, { merge: true });
  }

  async step2X_varifyCODE(
    //code:string, logged:string,
    credential: any,
    name: string, //password:string,
    phone: string,
    iso: string,
    coin: string
  ) {
    this.stepDisable = true;
    // const credential = await app.auth.PhoneAuthProvider.credential(this.verificationId, code);

    // const currentUser = await this.afAuth.currentUser;
    // if(!currentUser){
    //   return {"success":false,info:"401"}
    // }else{
    //   return {"success":true,complete:true, info:"" };
    // }

    const email = phone + '@' + 'refr.club';
    // const credential = await this.afAuth.createUserWithEmailAndPassword(email,password);
    // CREATE USER DOC TO FIRESTORE
    const storeData = await this.updateUserData(
      'phone',
      credential.user,
      phone,
      name,
      iso,
      coin,
      '',
      false
    )
      .then(() => {
        //     credential.user?.updateProfile({ displayName: name });
        if (credential.user) {
          let password = Date.now().toString();
          this.addEmallPass(email, password, name, '');
          return { success: true, complete: true, info: '' };
        } else {
          return { success: false, info: 'issue: invalid credentials' };
        }
      })
      .catch((err) => {
        return { success: false, info: 'issue: ' + err };
      });

    // // CREATE USER DOC TO FIRESTORE
    // if(!storeData.success){
    //   return storeData;
    // }else{
    //   // CREATE USER
    // }

    return storeData;
  }

  async addEmallPass(
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) {
    const currentUser: any = await this.afAuth.currentUser;
    //currentUser?.updateEmail(email).then(resEmail => {
    updateEmail(currentUser, email)
      .then((resEmail) => {
        updatePassword(currentUser, password)
          .then((resPass) => {
            updateProfile(currentUser, {
              displayName: displayName,
              photoURL: photoURL,
            })
              .then((resName) => {})
              .catch((err) => {});
          })
          .catch((err) => {});
      })
      .catch((err) => {}); /*
    //app.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
    // app.auth().currentUser.getIdToken(/ * forceRefresh * / true).then(function(idToken) {
    //   // Send token to your backend via HTTPS
    //   // ...
    //  }).catch(function(error) {
    //   // Handle error
    //  });
    //credential.user.updateEmail(email)
    //credential.user.updatePassword(password)
*/
  }

  async step2_varifyCODE(
    code: string,
    logged: string
    //name:string, pass: string
  ) {
    this.stepDisable = true;
    const credential: any = await PhoneAuthProvider.credential(
      this.verificationId,
      code
    );
    const currentUser: any = await this.afAuth.currentUser;
    if (!currentUser) {
      return { success: false, info: '401' };
    } else {
      //return currentUser.updatePhoneNumber(credential).then(() =>{
      return updatePhoneNumber(currentUser, credential)
        .then(() => {
          if (!logged) {
            //this.user$ = this.getLogUSER();
            this.resource.startSnackBar(
              this.resource.env.brand + ' Welcomes! ' + currentUser.displayName
            );
            return { success: true, complete: true, info: '' };
          } else {
            const email = logged + '@' + 'refr.club';
            currentUser.updateEmail(email);
            const userRef = doc(
              this.firestore,
              `${this.resource.env.db.users}`,
              `${currentUser.uid}`
            );
            updateDoc(userRef, { axess: arrayUnion('phone'), phone: logged });

            return { success: true, complete: true, info: '' };
          }
        })
        .catch((err) => {
          return { success: false, info: err };
        });
    }
  }

  async step3_login(phone: string, password: string) {
    this.stepDisable = true;

    const email = phone + '@' + 'refr.club';
    // LOG IN WITH PASSWORD
    //const credential = await this.afAuth.signInWithEmailAndPassword(email,password).then(data=>{
    const credential = await signInWithEmailAndPassword(
      this.afAuth,
      email,
      password
    )
      .then((data) => {
        // CHECK IF PHONE VARIFIED
        if (!data.user?.phoneNumber) {
          return { success: true, incomplete: true, phone: phone };
          // SETUP VARIVIED CODE STEP
          // REDIRECT VARIVIED CODE STEP
        } else {
          this.resource.startSnackBar('Welcome Back!');
          return { success: true, complete: true };
        }
      })
      .catch((err) => {
        this.resource.pass.setValue('');
        this.resource.pass.enable();
        return {
          success: false,
          info: 'issue: ' + err.message,
          code: err.code,
        };
      });
    return credential;
  }

  async step4_resetLogin(phone: string) {
    this.stepDisable = true;
    const appVerifier = this.windowRef.recaptchaVerifier;
    //return await this.afAuth.signInWithPhoneNumber( phone, appVerifier ).then(result =>{
    return await signInWithPhoneNumber(this.afAuth, phone, appVerifier)
      .then((result) => {
        this.verificationReset = result;
        this.step = 4;
        return { success: true, phone: phone };
      })
      .catch((err) => {
        return { success: false, info: 'issue: ' + err };
      });
  }

  async step5_reset(verificationCode: string, newPassword: string) {
    this.stepDisable = true;
    return await this.verificationReset
      .confirm(verificationCode)
      .then((ref: any) => {
        return ref.user
          ?.updatePassword(newPassword)
          .then(() => {
            const userRef = doc(
              this.firestore,
              `${this.resource.env.db.users}`,
              `${ref.user.uid}`
            );
            updateDoc(userRef, { axess: arrayUnion('pass') });

            this.resource.startSnackBar('Password Changed!');
            return { success: true, complete: true };
          })
          .catch((err: any) => {
            return { success: false, info: 'issue: ' + err };
          });
      });
  }

  async googleSignin() {
    //if(this.resource.appMode){
    /*
      GoogleAuth.initialize({
        clientId:"471641178783-poa1lb0fjdv7amnvh5ntftepaskgohh2.apps.googleusercontent.com",
        scopes:["profile", "email"]
      });

      let googleUser = await GoogleAuth.signIn();
      const provider = GoogleAuthProvider.credential(googleUser.authentication.idToken);

    const credential = signInWithCredential(this.afAuth, provider).then((result) => {
        this.ManMade = "ManMadeR: " + result.user.uid + " "+result.user.email;
        return {"success":true, social:true, medium:"google", data: result.user}
    }).catch((error) => {
        this.ManMade = "ManMadeRC: " + error;
        return {"success":false,info:"issue: " + error.message, code:error.code}
    })
    return credential;
    */
    //}else{
    const provider = new GoogleAuthProvider();
    const credential = signInWithPopup(this.afAuth, provider)
      .then((result) => {
        return {
          success: true,
          social: true,
          medium: 'google',
          data: result.user,
        };
      })
      .catch((error) => {
        return {
          success: false,
          info: 'issue: ' + error.message,
          code: error.code,
        };
      });
    return credential;
    //}
  }

  // async appleSignin() {
  //   const provider = new app.auth.GoogleAuthProvider();
  //   const credential = await this.afAuth.signInWithPopup(provider).then(data=>{
  //     return {"success":true, social:true, data: data}
  //     //return {"success":true,incomplete:true,phone:phone}
  //   }).catch(err =>{
  //     return {"success":false,info:"issue: " + err.message, code:err.code}
  //   });

  //   //return this.updateUserData(credential.user);
  //   return credential;
  // }

  async facebookSignin() {
    if (this.resource.appMode) {
      const credential = {
        success: false,
        info: 'Support coming soon...',
        code: 1000,
      };
      return credential;
    } else {
      /*
      const provider = new FacebookAuthProvider();
      const credential = signInWithPopup(this.afAuth, provider).then((result) => {
          return {"success":true, social:true, medium:"facebook", data: result.user}
      }).catch((error) => {
          return {"success":false,info:"issue: " + error.message, code:error.code}
      })*/
      const credential = {
        success: false,
        info: 'Support coming soon...',
        code: 1000,
      };
      return credential;
    }
  }

  async googleSync(hasfacebook: boolean) {
    //if(this.resource.appMode){
    /*
    GoogleAuth.initialize();
    let googleUser = await GoogleAuth.signIn();
    const provider = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    const credential:any = await this.afAuth.currentUser;
    const linkX = linkWithCredential(credential, provider).then(lin => {
      let newProfile:any = lin.user;
      let newEmail = newProfile.email || "";
      let newEmailV = newProfile.verified_email || false;
      if(!newProfile || !newEmail || !newEmailV){
        return {"success":false,info:"The account does not meet our social log in standards." }
      }else{
          const userData = !hasfacebook ? {
            axess: arrayUnion("google"),
            emails: arrayUnion(newEmail),
            email: newEmail
          } : {
            axess: arrayUnion("google"),
            emails: arrayUnion(newEmail)
          }

        const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${lin?.user?.uid}`);
        return updateDoc(userRef, userData).then(() => {
          return {"success":true, info:""}
        }).catch(err => {
          return {"success":false,info:"The account has issues. please contact our dev team." }
        })
      }
    }).catch(err => {
      return {"success":false,info:"issue: " + err.message, code:err.code}
    })
    return linkX;
    */
    //}else{
    const provider = new GoogleAuthProvider();
    const credential: any = await this.afAuth.currentUser;
    const linkX = linkWithPopup(credential, provider)
      .then((lin) => {
        let newProfile: any = lin.user;
        let newEmail = newProfile.email || '';
        let newEmailV = newProfile.verified_email || false;

        if (!newProfile || !newEmail || !newEmailV) {
          return {
            success: false,
            info: 'The account does not meet our social log in standards.',
          };
        } else {
          const userData = !hasfacebook
            ? {
                axess: arrayUnion('google'),
                emails: arrayUnion(newEmail),
                email: newEmail,
              }
            : {
                axess: arrayUnion('google'),
                emails: arrayUnion(newEmail),
              };

          const userRef = doc(
            this.firestore,
            `${this.resource.env.db.users}`,
            `${lin?.user?.uid}`
          );
          return updateDoc(userRef, userData)
            .then(() => {
              return { success: true, info: '' };
            })
            .catch((err) => {
              return {
                success: false,
                info: 'The account has issues. please contact our dev team.',
              };
            });
        }
      })
      .catch((err) => {
        return {
          success: false,
          info: 'issue: ' + err.message,
          code: err.code,
        };
      });

    return linkX;
    //}
  }

  async facebookSync(hasgoogle: boolean) {
    /*
    const provider = new FacebookAuthProvider();
    const credential:any = await this.afAuth.currentUser
    // .then(ref => {
    //   if(!ref){
    //     return {"success":false,info:"401"}
    //   }else{
    //     return ref?.linkWithPopup(provider).then(lin => {
    const linkX =  linkWithPopup(credential, provider).then(lin => {
          //let newProfile:any = lin.additionalUserInfo?.profile;
          let newProfile:any = lin.user;
          let newEmail = newProfile?.email || "";
          let newEmailV = newProfile?.verified_email || false;

          if(!newProfile || !newEmail || !newEmailV){
            return {"success":false,info:"The account does not meet our social log in standards." }
          }else{

              const userData = !hasgoogle ? {
                axess: arrayUnion("facebook"),
                emails: arrayUnion(newEmail),
                email: newEmail
              } : {
                axess: arrayUnion("facebook"),
                emails: arrayUnion(newEmail)
              }

            const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${lin?.user?.uid}`)
            return updateDoc(userRef, userData).then(() => {
              return {"success":true, info:""}
            }).catch(err => {
              return {"success":false,info:"The account has issues. please contact our dev team." }
            })
          }
        }).catch(err => {
          return {"success":false,info:"issue: " + err.message, code:err.code}
        })
    //   }
    // }).catch(err =>{
    //   return {"success":false, info:"issue: " + err.message, code: err.code}
    // })
    return linkX;
*/
    const credential = {
      success: false,
      info: 'Support coming soon...',
      code: 1000,
    };
    return credential;
  }

  // async microsoftSignin() {
  //   const provider = new app.auth.GoogleAuthProvider;
  //   const credential = await this.afAuth.signInWithPopup(provider).then(data=>{
  //     return {"success":true, social:true, data: data}
  //     //return {"success":true,incomplete:true,phone:phone}
  //   }).catch(err =>{
  //     return {"success":false,info:"issue: " + err.message, code:err.code}
  //   });

  //   //return this.updateUserData(credential.user);
  //   return credential;
  // }

  socialCreate(cred: any, medium: string) {
    const newUser = {
      user: { uid: cred.uid },
      phone: '',
      name: cred.displayName,
      iso: '',
      coin: '',
      email: cred.email,
      emailV: true,
    };
    return this.updateUserData(
      medium,
      newUser.user,
      newUser.phone,
      newUser.name,
      newUser.iso,
      newUser.coin,
      newUser.email,
      newUser.emailV
    );
  }

  // upgradeSocial(){
  //   this.user$ = this.getLogUSER();
  // }

  async signOut() {
    //this.resource.playSound('beep');
    this.resource.first.reset();
    this.resource.last.reset();
    this.resource.pass.reset();
    //this.resource.username.reset();
    //this.resource.info.reset();
    //this.resource.url.reset();
    //this.resource.profession.reset();

    await this.afAuth.signOut();
    this.resource.router.navigate(['']);
  }
  // AUTH SYSTEM

  // UPDATE ABOUT

  async updateUserBio(
    uid: string,
    nameCu: string,
    name: string,
    soIG: string,
    soYT: string,
    soTW: string,
    soWA: string
    //username:string, info:string, url:string, typ:number, sex:number, stat:string
  ) {
    const newTimestamp = this.getServerTimestamp();
    if (nameCu !== name) {
      const credential: any = await this.afAuth.currentUser;
      //this.afAuth.currentUser.then(data => { data?.updateProfile({displayName:name}) });
      updateProfile(credential, { displayName: name });
      // if(!username){ //NO USERNAME
      //   let looks:string[] = this.resources.getLOOKUP( name.toLowerCase() );
      //   return this.afs.doc<User>(`${this.resources.env.db.users}/${uid}`).update({ name:name, info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks, upd: newTimestamp });
      // }else{ //HAS USERNAME
      //   let looks:string[] = this.resources.getLOOKUP( username +' '+ name.toLowerCase() );
      const userRef = doc(
        this.firestore,
        `${this.resource.env.db.users}`,
        `${uid}`
      );
      return updateDoc(userRef, {
        name: name,
        //info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks,
        upd: newTimestamp,
      });
      // }
    } else {
      const userRef = doc(
        this.firestore,
        `${this.resource.env.db.users}`,
        `${uid}`
      );
      return updateDoc(userRef, {
        //name:name,
        soIG,
        soYT,
        soTW,
        soWA,
        //info:info, url:url, typ:typ, sex:sex, stat:stat,
        upd: newTimestamp,
      });
    }
  }

  clearNotifications() {
    const newTimestamp = this.getServerTimestamp();
    this.user$.pipe(take(1)).subscribe((ref) => {
      if (!ref) {
        this.resource.startSnackBar('issue: Failed to clear notifications');
        return EMPTY;
      } else {
        const userRef = doc(
          this.firestore,
          `${this.resource.env.db.users}`,
          `${ref.uid}`
        );
        return updateDoc(userRef, {
          note: [],
          upd: newTimestamp,
        });
      }
    });
  }
  // UPDATE ABOUT

  getCategoryList() {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.categories}`
    );
    const qu = query(catData, orderBy('title'), limit(22));
    return collectionData(qu);
    //  r => r
    // .orderBy("title")
    // .limit(22)
    // )

    //.valueChanges();
  }

  createStore(data: any, logo: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const locateID = data.nationISO + '_' + data.stateISO + '_' + Date.now();

    const dataSend: Shop = {
      id: '', //this.storeLoc
      email: data.email,
      phone: data.phone,
      name: data.storeName,
      logo: '',
      banner: '',
      banners: [],
      type: data.storeType,
      typeORDER: {
        logistics: data.logistics,
        delivery: data.delivery,
        exchange: data.exchange,
        return: data.exchange,
        refund: data.exchange,
        COD: data.COD,
      },
      cat: data.storeCat,
      subCat: data.storeSubCat,
      proCat: [],
      products: 0,
      loc: [
        {
          id: locateID,
          lat: data.loc.latitude || '',
          lon: data.loc.longitude || '',
          area: data.locSearch,
          line1: data.locAddress,
          line2: '',
          locality: data.locality,
          zip: data.postal_code,
          region: data.administrative_area_level_1,
          city: data.administrative_area_level_2,
          state: data.stateISO,
          nation: data.nationISO,
        },
      ],
      schedule: {
        opensDaily: data.opensDaily,
        opensDailyS: data.opensDailyS,
        opensDailyE: data.opensDailyE,
        openMon: data.openMon,
        openMonS: data.openMonS,
        openMonE: data.openMonE,
        openTue: data.openTue,
        openTueS: data.openTueS,
        openTueE: data.openTueE,
        openWed: data.openWed,
        openWedS: data.openWedS,
        openWedE: data.openWedE,
        openThu: data.openThu,
        openThuS: data.openThuS,
        openThuE: data.openThuE,
        openFri: data.openFri,
        openFriS: data.openFriS,
        openFriE: data.openFriE,
        openSat: data.openSat,
        openSatS: data.openSatS,
        openSatE: data.openSatE,
        openSun: data.openSun,
        openSunS: data.openSunS,
        openSunE: data.openSunE,
      },
      by: data.by,
      sin: newTimestamp,
      log: newTimestamp,
      upd: newTimestamp,
    };

    //const shopRef: AngularFirestoreDocument<Shop> = this.afs.doc(`${this.resource.env.db.shops}/${data.by}`);
    //return shopRef.set(dataSend, { merge: true }).then(() => {
    const shopRefC = collection(
      this.firestore,
      `${this.resource.env.db.shops}`
    );
    return addDoc(shopRefC, dataSend).then((ref) => {
      const refUser = doc(
        this.firestore,
        `${this.resource.env.db.users}`,
        `${data.by}`
      );
      return updateDoc(refUser, { storeLoc: arrayUnion(ref.id) }).then(
        async () => {
          const shopRef = doc(
            this.firestore,
            `${this.resource.env.db.shops}`,
            `${ref.id}`
          );

          const cloudUploadLogo = await this.cloudUpload(ref.id, logo);
          const cloudUploadBanner = await this.cloudUpload(ref.id, banner);
          return updateDoc(shopRef, {
            id: ref.id,
            logo: cloudUploadLogo.url,
            banner: cloudUploadBanner.url,
          })
            .then(() => {})
            .catch((err) => {
              return err;
            });
        }
      );
    });
  }

  addPhoneNumber(uid: string, phone: string, iso: string, coin: string) {
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.users}`,
      `${uid}`
    );
    return updateDoc(userRef, { phone: phone, iso: iso, coin: coin });
  }

  addLocation(data: any) {
    const newTimestamp = this.getServerTimestamp();
    const locateID = data.nationISO + '_' + data.stateISO + '_' + Date.now();

    const dataSend: Locate = {
      id: locateID,
      lat: data.loc.latitude,
      lon: data.loc.longitude,
      area: data.locSearch,
      line1: data.locAddress,
      line2: '',
      locality: data.locality,
      zip: data.postal_code,
      region: data.administrative_area_level_1,
      city: data.administrative_area_level_2,
      state: data.stateISO,
      nation: data.nationISO,
    };
    const refShop = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${data.storeID}`
    );
    return updateDoc(refShop, { loc: arrayUnion(dataSend), upd: newTimestamp });
  }
  /*
  addProduct(data:any, banners:string[]){
    const newTimestamp = this.getServerTimestamp();
    //const productID = Date.now() + "_" + "";

    const dataSend:Product =   {
      id: "",//productID,

      title:data.productName, description:data.description, banners:[],
      price:data.price, cost:data.cost, quota: 0, sold:0,
      category:data.category, code:data.code, variants:data.variants,
      warranty:data.warranty, content:data.content,

      sin:newTimestamp, upd:newTimestamp, by:data.by, sid:data.storeID
    }
    const thingsRefC = collection(this.firestore, `${this.resource.env.db.things}`)
    return addDoc(thingsRefC, dataSend).then(ref => {
      const storeRef = doc(this.firestore, `${this.resource.env.db.shops}`, `${data.storeID}`);
      return updateDoc(storeRef, {
        products: increment(1),
        proCat: arrayUnion(data.category),
      }).then(async () => {
        const thingsRef = doc(this.firestore, `${this.resource.env.db.things}`, `${ref.id}`);

        if(banners.length == 0){

          return updateDoc(thingsRef, {id:ref.id, banners:[] }).then(() => {
            return ref;
          })

        }else{

          const bannersList = [];
          for (let i = 0; i < banners.length; i++) {
            const cloudUpload = await this.cloudUpload(ref.id, banners[i]);
            if(cloudUpload.success){bannersList.push(cloudUpload.url)}
            if(banners.length == (i + 1)){
              return updateDoc(thingsRef, {id:ref.id, banners:bannersList }).then(() => {
                return ref;
              })
            }
          }

        }


      })

      // return this.afs.doc<User>(`${this.resource.env.db.users}/${data.by}`).update({storeLoc: arrayUnion(ref.id)}).then(() => {
      //   return ref.update({id:ref.id, logo:logo, banner:banner}).then(() => {
      //   }).catch(err => {
      //     return err;
      //   })
    })
      //proCat: arrayUnion(data.category),
      //products: arrayUnion(dataSend),
      //upd: newTimestamp })
  }
  */
  getMyStore(uid: string) {
    const catDataC = collection(
      this.firestore,
      `${this.resource.env.db.shops}`
    );
    const qu = query(catDataC, where('by', '==', uid));
    return collectionData(qu);
  }

  addNewCampaign(tX: string, data: any, payCustom: number) {
    const newTimestamp = this.getServerTimestamp();

    const dataSend: Hype = {
      id: '',
      tX: tX,
      customAct: false,
      customPay: payCustom,
      type: data.type,
      storeTyp: data.storeTyp,
      paid: false,
      name: data.campaignName,
      cbNew: data.cbNew,
      cbExi: data.cbExi,
      cbDir: data.cbDir,
      min: data.min,
      max: data.max,
      expiry: data.expiry,
      dateS: data.dateS,
      dateE: data.dateE,
      stage: data.stage,
      paused: false,
      stoped: false,
      ban: false,
      countS: 0,
      countP: 0,
      countM: 0,
      sin: newTimestamp,
      upd: newTimestamp,
      by: data.by,
      sid: data.storeID,
    };
    const hypeRefC = collection(
      this.firestore,
      `${this.resource.env.db.hypes}`
    );
    return addDoc(hypeRefC, dataSend).then((ref) => {
      const userRef = doc(
        this.firestore,
        `${this.resource.env.db.users}`,
        `${data.by}`
      );
      return updateDoc(userRef, { storeCam: arrayUnion(ref.id) })
        .then(() => {
          const hypeRef = doc(
            this.firestore,
            `${this.resource.env.db.hypes}`,
            `${ref.id}`
          );
          return updateDoc(hypeRef, { id: ref.id })
            .then(() => {
              return ref;
            })
            .catch((err) => {
              // HANDLE ISSUE
              return err;
            });
        })
        .catch((err) => {
          // HANDLE ISSUE
          return err;
        });
    });
  }

  getCampaignByID(id: string) {
    const catDataC = collection(
      this.firestore,
      `${this.resource.env.db.hypes}`
    );
    const qu = query(catDataC, where('id', '==', id));
    return collectionData(qu);
  }

  getMyCampaignByUID(uid: string, s: number) {
    const catDataC = collection(
      this.firestore,
      `${this.resource.env.db.hypes}`
    );
    const qu = query(
      catDataC,
      where('by', '==', uid),
      orderBy('sin', 'desc'),
      limit(s)
    );
    return collectionData(qu);
  }

  getMyProductByUID(uid: string, s: number) {
    const catDataC = collection(
      this.firestore,
      `${this.resource.env.db.things}`
    );
    const qu = query(
      catDataC,
      where('by', '==', uid),
      orderBy('sin', 'desc'),
      limit(s)
    );
    return collectionData(qu);
  }

  async updateStoreBio(
    id: string,
    nameCu: string,
    name: string
    //soIG:string, soYT:string, soTW:string, soWA:string
    //username:string, info:string, url:string, typ:number, sex:number, stat:string
  ) {
    const newTimestamp = this.getServerTimestamp();
    //const credential:any = await this.afAuth.currentUser;
    //this.afAuth.currentUser.then(data => { data?.updateProfile({displayName:name}) });
    //updateProfile(credential, {displayName:name})
    // if(!username){ //NO USERNAME
    //   let looks:string[] = this.resources.getLOOKUP( name.toLowerCase() );
    //   return this.afs.doc<User>(`${this.resources.env.db.users}/${uid}`).update({ name:name, info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks, upd: newTimestamp });
    // }else{ //HAS USERNAME
    //   let looks:string[] = this.resources.getLOOKUP( username +' '+ name.toLowerCase() );
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      name: name,
      //soIG, soYT, soTW, soWA,
      //info:info, url:url, typ:typ, sex:sex, stat:stat, look:looks,
      upd: newTimestamp,
    });
  }

  async updateStoreLogo(id: string, logo: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, logo);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        logo: cloudUpload.url,
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async updateStoreBanner(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${id}`
    );
    const cloudUpload = await this.cloudUpload(id, banner);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        banner: cloudUpload.url,
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async addStoreBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    console.log('1234567890');

    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${id}`
    );
    console.log('123', userRef);

    const cloudUpload = await this.cloudUpload(id, banner);
    if (!cloudUpload.success) {
      return cloudUpload;
    } else {
      return updateDoc(userRef, {
        banners: arrayUnion(cloudUpload.url),
        upd: newTimestamp,
      }).then(() => {
        return cloudUpload;
      });
    }
  }

  async removeStoreBanners(id: string, banner: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.shops}`,
      `${id}`
    );
    return updateDoc(userRef, {
      banners: arrayRemove(banner),
      upd: newTimestamp,
    });
  }

  cloudUpload(idX: string, base64String: string) {
    const imgID = idX + Date.now();
    const bannerRef = ref(this.fireStorage, 'store/' + imgID);

    return uploadString(bannerRef, base64String.split(',')[1], 'base64')
      .then((snapshot) => {
        return getDownloadURL(bannerRef).then((dlURL) => {
          return { success: true, url: dlURL };
        });
      })
      .catch((err) => {
        return { success: false, url: '' };
      });
  }

  // --

  // async videoUpload(id: string, banner: string) {
  //   console.log('123456');
  //   console.log('id', id);

  //   const newTimestamp = this.getServerTimestamp();
  //   const userRef = doc(
  //     this.firestore,
  //     `${this.resource.env.db.shops}`,
  //     `${id}`
  //   );
  //   console.log('09876543');

  //   const cloudUpload = await this.videoUploadF(id, banner);
  //   console.log('cloudupload url', cloudUpload.url);

  //   if (!cloudUpload.success) {
  //     return cloudUpload;
  //   } else {
  //     return updateDoc(userRef, {
  //       banner: cloudUpload.url,
  //       upd: newTimestamp,
  //     }).then(() => {
  //       return cloudUpload;
  //     });
  //   }
  // }

  // top feed video start

  cloudVideoUpload(base64String: string) {
    console.log('1111');

    const imgID = 'feedVideos' + Date.now();
    console.log('2222');

    const bannerRef = ref(this.fireStorage, 'FeedVideos/' + imgID);
    console.log('3333');

    return uploadString(bannerRef, base64String.split(',')[1], 'base64')
      .then((snapshot) => {
        console.log('4444');
        return getDownloadURL(bannerRef).then((dlURL) => {
          return { success: true, url: dlURL };
        });
      })
      .catch((err) => {
        return { success: false, url: '' };
      });
  }

  // --------------------------------------

  /*
  startX(){

    const x = [

      {
          id:"healthcare", title:"Healthcare", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// Healthcare
              {id:"sc-healthcare-dermat", icon:"", anim:"", img:"", name:"Dermat", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-dentist", icon:"", anim:"", img:"", name:"Dentist", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-general-physician", icon:"", anim:"", img:"", name:"General Physician", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-ent", icon:"", anim:"", img:"", name:"Ent", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-ophthal", icon:"", anim:"", img:"", name:"Ophthal", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-child-specialist", icon:"", anim:"", img:"", name:"Child Specialist", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-diagnostic-centre", icon:"", anim:"", img:"", name:"Diagnostic centre", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-mental-health", icon:"", anim:"", img:"", name:"Mental Health", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-general-surgery", icon:"", anim:"", img:"", name:"General Surgery", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-homeopathy", icon:"", anim:"", img:"", name:"Homeopathy", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-physiotherapy", icon:"", anim:"", img:"", name:"Physiotherapy", type:"healthcare", rank:0, count:0},
              {id:"sc-healthcare-ayurveda", icon:"", anim:"", img:"", name:"Ayurveda", type:"healthcare", rank:0, count:0},
          ]
      },

      {
          id:"food_and_beverages", title:"Food & Beverages", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// food & beverages
              {id:"sc-food_and_beverages-bakery", icon:"", anim:"", img:"", name:"Bakery", type:"food_and_beverages", rank:0, count:0 },
              {id:"sc-food_and_beverages-cafe", icon:"", anim:"", img:"", name:"Cafe", type:"food_and_beverages", rank:0, count:0},
              {id:"sc-food_and_beverages-restaurants", icon:"", anim:"", img:"", name:"Restaurants", type:"food_and_beverages", rank:0, count:0},
              {id:"sc-food_and_beverages-clubs_and_bars", icon:"", anim:"", img:"", name:"Clubs & Bars", type:"food_and_beverages", rank:0, count:0},
          ]
      },

      {
          id:"electronics", title:"Electronics", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// Electronics
              {id:"sc-electronics-televisions_and_large_appliances", icon:"", anim:"", img:"", name:"Televisions & large appliances", type:"electronics", rank:0, count:0},
              {id:"sc-electronics-accessories", icon:"", anim:"", img:"", name:"Accessories", type:"electronics", rank:0, count:0},
              {id:"sc-electronics-mobile_phones", icon:"", anim:"", img:"", name:"Mobile Phones", type:"electronics", rank:0, count:0},
          ]
      },

      {
          id:"fitness", title:"Fitness", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// fitness
              {id:"sc-fitness-pre_natal_classes", icon:"", anim:"", img:"", name:"Pre-natal classes", type:"fitness", rank:0, count:0},
              {id:"sc-fitness-dance_studios", icon:"", anim:"", img:"", name:"Dance Studios", type:"fitness", rank:0, count:0},
              {id:"sc-fitness-yoga", icon:"", anim:"", img:"", name:"Yoga", type:"fitness", rank:0, count:0},
              {id:"sc-fitness-fitness_studios", icon:"", anim:"", img:"", name:"Fitness Studios", type:"fitness", rank:0, count:0},
              {id:"sc-fitness-gym", icon:"", anim:"", img:"", name:"Gym", type:"fitness", rank:0, count:0},
          ]
      },

      {
          id:"fashion_brand", title:"Fashion brand", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// Fashion brand
              {id:"sc-fashion_brand-kids_fashion", icon:"", anim:"", img:"", name:"Kids Fashion", type:"fashion_brand", rank:0, count:0},
              {id:"sc-fashion_brand-mens_fashion", icon:"", anim:"", img:"", name:"Mens Fashion", type:"fashion_brand", rank:0, count:0},
              {id:"sc-fashion_brand-womens_fashion", icon:"", anim:"", img:"", name:"Womens Fashion", type:"fashion_brand", rank:0, count:0},
          ]
      },

      {
          id:"salons_and_spa", title:"Salons & Spa", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// Salons & Spa
              {id:"sc-salons_and_spa-unisex_salon", icon:"", anim:"", img:"", name:"Unisex Salon", type:"salons_and_spa", rank:0, count:0},
              {id:"sc-salons_and_spa-women_salon", icon:"", anim:"", img:"", name:"Women Salon", type:"salons_and_spa", rank:0, count:0},
              {id:"sc-salons_and_spa-men_salon", icon:"", anim:"", img:"", name:"Men Salon", type:"salons_and_spa", rank:0, count:0},
              {id:"sc-salons_and_spa-children_salon", icon:"", anim:"", img:"", name:"Children Salon", type:"salons_and_spa", rank:0, count:0},
              {id:"sc-salons_and_spa-nail_spa", icon:"", anim:"", img:"", name:"Nail Spa", type:"salons_and_spa", rank:0, count:0},
              {id:"sc-salons_and_spa-unisex_spa", icon:"", anim:"", img:"", name:"Unisex Spa", type:"salons_and_spa", rank:0, count:0},
          ]
      },

      {
          id:"professionals", title:"Professionals", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// Professionals
              {id:"sc-professionals-chemists", icon:"", anim:"", img:"", name:"Chemists", type:"professionals"},
              {id:"sc-professionals-architects", icon:"", anim:"", img:"", name:"Architects", type:"professionals"},
              {id:"sc-professionals-lawyers", icon:"", anim:"", img:"", name:"Lawyers", type:"professionals"},
              {id:"sc-professionals-designers", icon:"", anim:"", img:"", name:"Designers", type:"professionals"},
              {id:"sc-professionals-teachers", icon:"", anim:"", img:"", name:"Teachers", type:"professionals"},
          ]
      },

      {
          id:"supermarket", title:"Supermarket", icon:"", anim:"", img:"", rank:0, count:0,
          items:[// Supermarket
          ]
      },

  ];

    for (let i = 0; i < x.length; i++) {
      const element = x[i];

      const userRef = doc(this.firestore, `${this.resource.env.db.categories}`, `${element.id}`);
      setDoc(userRef, element);
    }
  }
  */

  getUserList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.users}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'asc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getStoreList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.shops}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'desc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getCampaignList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.hypes}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'asc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getProductList(c: number) {
    const catData: CollectionReference = collection(
      this.firestore,
      `${this.resource.env.db.things}`
    );
    const qu = query(
      catData,
      //where("ban", "==", false),
      orderBy('sin', 'asc'),
      limit(c)
    );
    return collectionData(qu);
  }

  getOrderList(c: number) {
    /*
    const catData:CollectionReference = collection(this.firestore, `${this.resource.env.db.things}`)
    const qu = query(catData,
      //where("ban", "==", false),
      orderBy("sin", "asc"),
      limit(c)
    );
    return collectionData( qu )
    */
  }

  async updateUserSNS(uid: string, token: string) {
    const newTimestamp = this.getServerTimestamp();
    const userRef = doc(
      this.firestore,
      `${this.resource.env.db.users}`,
      `${uid}`
    );
    return updateDoc(userRef, {
      tokenSNS: token,
      tokenSNS_: arrayUnion(token),
      upd: newTimestamp,
    });
  }
}
