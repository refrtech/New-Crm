import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { NotifyService } from 'src/app/notify.service';
import { ThemeService } from 'src/app/theme.service';
import { User } from 'src/app/universal.model';
import { environment } from 'src/environments/environment';

export class PhoneNumber {
  country: string = '91';
  iso: string = 'IND';
  coin: string = 'INR';
  digits: number = 10;
  area: string = '';
  prefix: string = '';
  line: string = '';
  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }
}
@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit {
  phoneNumber = new PhoneNumber();
  phoneNumFull: string = '';
  verificationCode: string = '';
  credentialX = '';

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    private notifyService: NotifyService,
    private dialogRef: MatDialogRef<SignComponent>
  ) {}

  ngOnInit(): void {
    this.auth.setupReCapca();
  }

  setContactNumber() {
    console.log(this.phoneNumFull);
    // if(!know){
    //   this.phoneNumber.area = "";
    //   this.phoneNumber.prefix = "";
    //   this.phoneNumber.line = "";
    // }else{
    this.phoneNumber.area = this.phoneNumFull.slice(0, 3);
    this.phoneNumber.prefix = this.phoneNumFull.slice(3, 6);
    this.phoneNumber.line = this.phoneNumFull.slice(6, this.phoneNumber.digits);

    //}
  }

  step0() {
    //FIGREOUT USER > NEW=SIGNUP|OLD=LOGIN

    let validatePhone =
      this.phoneNumber.country +
      this.phoneNumber.area +
      this.phoneNumber.prefix +
      this.phoneNumber.line;
    if (this.auth.resource.invalidPhone(validatePhone)) {
      this.auth.resource.startSnackBar('issue: format must be 0-9.');
    } else {
      const phone = this.phoneNumber.e164;
      const step0_CheckUserExist = this.auth.step0_userForward(phone, false);
      step0_CheckUserExist.then((data: any) => {
        console.log('Mega', data);
        if (!data.success) {
          //console.log("Dip Err")
          this.finalRESULT(data);
        } else {
          if (!data.exist) {
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar('No such account exists.');
            /*
            this.auth.verifyPhoneWithOTPX( phone, false ).then(dataV => {
              //this.auth.stepDisable = false; 
              //this.finalRESULT(dataV);
              if(!dataV.success){
                this.finalRESULT(dataV);
              }else{
                this.auth.resource.first.reset();
                //this.auth.resource.pass.reset();
                this.auth.stepDisable = false;
                this.auth.step = 1;
                //this.auth.resource.first.
              }
            })
            // .catch(err => {
            //   console.log("Dip Err")
            //   this.finalRESULT({"success":false,info:"401"});
            // });
*/
          } else {
            this.auth.verifyPhoneWithOTPX(phone, false).then((dataV) => {
              //this.auth.stepDisable = false;
              //this.finalRESULT(dataV);
              if (!dataV.success) {
                this.finalRESULT(dataV);
              } else {
                //this.auth.resource.first.reset();
                //this.auth.resource.pass.reset();
                this.auth.stepDisable = false;
                this.auth.step = 5;
                //this.auth.resource.first.
              }
            });
            // this.auth.resource.pass.reset();
            // this.auth.step = 3;
            // this.auth.stepDisable = false;
          }
        }

        /*
        const step1_newUSER = this.auth.step1_newUSER( 
          this.phoneNumber.e164, //validatePassword, name, 
          //this.phoneNumber.iso, this.phoneNumber.coin 
          );

       step1_newUSER.then((ref:any) =>{
         console.log(ref)
        if(ref.success){
          this.auth.verifyPhoneWithOTPX( ref.phone, false ).then(dataV => {
            this.auth.stepDisable = false; 
            this.finalRESULT(dataV);
            this.auth.step = 1;
          });
          // this.auth.verifyPhoneWithOTP( ref.phone, false ).then(dataV => {
          //   this.auth.stepDisable = false; 
          //   //this.finalRESULT(dataV);
          //   this.auth.step = 1;
          // });
        }else{
          console.log("Something here...")
        }
        //this.finalRESULT(data);
       })
       */
      });
    }
  }

  step1X() {
    //CREATE NEW USER
    this.auth.resource.first.disable();
    //this.auth.resource.pass.disable();

    let validatePassword = this.auth.resource.pass.value;
    if (this.auth.resource.invalidPassword(validatePassword)) {
      //this.auth.resource.pass.setValue("");
      this.auth.resource.first.enable();
      //this.auth.resource.last.enable();
      //this.auth.resource.pass.enable();
      this.verificationCode = '';
      this.auth.resource.startSnackBar('issue: format must be 0-9A-Za-z@.');
    } else {
      const name = this.auth.resource.first?.value; //+" "+ this.auth.resource.last?.value;
      //const pass = this.auth.resource.pass.value;

      if (this.verificationCode?.length < 6) {
        this.auth.resource.startSnackBar('issue: verification code invalid.');
      } else {
        this.auth.confirmationResult
          .confirm(this.verificationCode)
          .then((credential: any) => {
            //console.log(credential.user)
            this.auth
              .step2X_varifyCODE(
                credential,
                name, //pass,
                this.phoneNumber.e164,
                this.phoneNumber.iso,
                this.phoneNumber.coin
              )
              .then((creUser) => {
                this.finalRESULT(creUser);
                this.goToDash();
              });
            // .catch(err =>{
            //   console.log("Err", err)
            //   this.auth.resource.startSnackBar(err);
            // })
          })
          .catch((err: any) => {
            console.error(err);
            this.verificationCode = '';
            this.auth.resource.startSnackBar(err);
          });
        // console.log(this.verificationCode, "", name, pass)
        // this.auth.step2X_varifyCODE(this.verificationCode, "", name, pass,
        // this.phoneNumber.e164, //validatePassword, name,
        // this.phoneNumber.iso, this.phoneNumber.coin
        // ).then(data => {
        //   console.log(data)
        //   //this.auth.resource.playSound('beep')
        //   //this.finalRESULT(data);
        // })
      }
    }
  }

  step6() {
    if (this.verificationCode?.length < 6) {
      this.auth.resource.startSnackBar('issue: verification code invalid.');
    } else {
      this.auth.confirmationResult
        .confirm(this.verificationCode)
        .then((credential: any) => {
          //console.log(credential.user)
          //this.auth.step2X_varifyCODE(credential, //name, //pass,
          //this.phoneNumber.e164, this.phoneNumber.iso, this.phoneNumber.coin ).then(creUser => {
          //this.finalRESULT(creUser);
          this.goToDash();
          //})
          // .catch(err =>{
          //   console.log("Err", err)
          //   this.auth.resource.startSnackBar(err);
          // })
        })
        .catch((err: any) => {
          console.error(err);
          this.verificationCode = '';
          this.auth.resource.startSnackBar(err);
        });
    }
  }

  // step1(){//CREATE NEW USER
  //     this.auth.resource.first.disable();
  //     this.auth.resource.last.disable();
  //     this.auth.resource.pass.disable();

  //   let validatePassword = this.auth.resource.pass.value;
  //   if( this.auth.resource.invalidPassword(validatePassword) ){
  //     this.auth.resource.pass.setValue("");
  //     this.auth.resource.first.enable();
  //     this.auth.resource.last.enable();
  //     this.auth.resource.pass.enable();
  //     this.auth.resource.startSnackBar("issue: format must be 0-9A-Za-z@.")
  //   }else{
  //     const name = this.auth.resource.first?.value +" "+ this.auth.resource.last?.value;
  //     const step1_newUSER = this.auth.step1_newUSER( this.phoneNumber.e164, validatePassword, name, this.phoneNumber.iso, this.phoneNumber.coin );

  //     step1_newUSER.then((ref:any) =>{
  //       //this.finalRESULT(data);
  //       if(ref.success){
  //         this.auth.verifyPhoneWithOTP( ref.phone, false ).then(data => {
  //           this.finalRESULT(data);
  //         });
  //       }else{
  //         console.log("Something here...")
  //       }
  //     })
  //   }
  // }

  // step2(){//VARIFY USER
  //   if(this.verificationCode?.length < 6){
  //     this.auth.resource.startSnackBar("issue: verification code invalid.")
  //   }else{
  //     this.auth.step2_varifyCODE(this.verificationCode, "").then(data => {
  //       //this.auth.resource.playSound('beep')
  //       this.finalRESULT(data);
  //     })
  //   }
  // }

  step2() {
    this.auth.resource.pass.reset();
    this.auth.stepDisable = false;
    this.auth.step = 3;
  }

  step3() {
    //OLD USER LOG IN

    this.auth.resource.pass.disable();

    let validatePassword = this.auth.resource.pass.value;
    if (this.auth.resource.invalidPassword(validatePassword)) {
      this.auth.resource.pass.setValue('');
      this.auth.resource.pass.enable();
      this.verificationCode = '';
      this.auth.resource.startSnackBar('issue: format must be 0-9A-Za-z@.');
    } else {
      this.auth
        .step3_login(this.phoneNumber.e164, validatePassword)
        .then((data) => {
          //this.auth.resource.playSound('beep');
          this.finalRESULT(data);
          //UPDATE ALLOW NOTIFICATION SEND
          if ((data.success && environment.production) || true) {
            this.setUpNotify();
            //.filter(user => !!user) // filter null
            // take first real user
            //this.auth.user$.pipe(take(1)).subscribe(user => {
            //if (user) {
            //this.notifyService.getPermission(user)
            //this.notifyService.monitorRefresh(user)
            //this.notifyService.receiveMessages()
            //}
            //})
          }
          //UPDATE ALLOW NOTIFICATION SEND
        });
    }
  }

  step4() {
    //OLD USER FORGOT PASSWOZRD
    this.auth.step4_resetLogin(this.phoneNumber.e164).then((data) => {
      this.finalRESULT(data);
    });
  }

  step5() {
    //OLD USER FORGOT PASSWOZRD

    this.auth.resource.pass.disable();

    let validatePassword = this.auth.resource.pass.value;
    if (this.auth.resource.invalidPassword(validatePassword)) {
      this.auth.resource.pass.setValue('');
      this.auth.resource.pass.enable();
      this.auth.resource.startSnackBar('issue: format must be 0-9A-Za-z@.');
    } else {
      this.auth
        .step5_reset(this.verificationCode, this.auth.resource.pass.value)
        .then((data) => {
          this.finalRESULT(data);
        });
    }
  }

  social(signFor: string) {
    /*
    if(signFor == "google"){
      this.auth.googleSignin().then((data:any) => {
        console.log(data)
        this.finalRESULT(data)
      }).catch(err => {
        this.credentialX = "Ve: " + err;
      })
    }

    if(signFor == "facebook"){
      this.auth.facebookSignin().then(data => {
        this.finalRESULT(data)
      })
    }
*/
  }

  signWithSocial(cred: any, medium: string) {
    //console.log("Maron 5", cred)

    const step0_CheckUserExist = this.auth.step0_socialForward(
      cred.uid,
      cred.email
    );

    step0_CheckUserExist.then((ref) => {
      console.log('MEGA', ref);
      if (!ref) {
        const data = { success: false, info: '401' };
        this.finalRESULT(data);
      } else {
        this.credentialX = 'V: ' + ref.exists() + ' ' + ref.id;
        const existsX = ref.exists();
        if (!existsX) {
          // create new user
          this.auth.socialCreate(cred, medium).then((x: any) => {
            this.goToDash();
            //console.log("One",x)
            //this.auth.upgradeSocial();
          });
        } else {
          this.goToDash();
          //this.auth.upgradeSocial();
          // sign current user
          //socialCreate
        }
      }
      /*
      v.pipe(take(1)).subscribe((ref:any) => {
        console.log("MEGA", ref)
        if(!ref){
          const data = {"success":false, info:"401"}
          this.finalRESULT(data);
        }else{

        }
        */
    });

    /*
      v.pipe(take(1)).subscribe((ref:any) => {
        console.log("Maddam", ref)
           if(!ref){
             const data = {"success":false, info:"401"}
             this.finalRESULT(data);
           }else{
                if(!ref.exists){
                  // create new user
                  this.auth.socialCreate(cred, medium).then((x:any) => {
                    this.goToDash()
                    //console.log("One",x)
                    //this.auth.upgradeSocial();
                  })
                }else{
                  this.goToDash()
                  //this.auth.upgradeSocial();
                  // sign current user
                  //socialCreate
                }
           }
      })
    })
      */
    //.catch(err => {})
    //step0_CheckUserExist.then((data:any) =>{
    //this.finalRESULT(data);
    //})
  }

  finalRESULT(data: any) {
    if (!data.success) {
      if (data.info !== '401') {
        this.auth.stepDisable = false;
        this.auth.resource.startSnackBar(data.info);
      } else {
        this.auth.stepDisable = false;
        this.auth.resource.startSnackBar('issue: Dirty Data!');
        this.dialogRef.close();
      }
      if (data.code == 'auth/user-disabled') {
        this.dialogRef.close();
      }
    } else {
      this.auth.stepDisable = false;

      if (data.complete) {
        this.goToDash();
      }

      if (data.incomplete) {
        //this.auth.step = 2; // PHONE NUMBER VARIFY
        this.auth.resource.startSnackBar('Please Complete Sign Up Process!');
        this.auth.verifyPhoneWithOTP(data.phone, false).then((data) => {
          this.finalRESULT(data);
        });
      }

      if (data.social) {
        this.signWithSocial(data.data, data.medium);
      }
    }
  }

  setUpNotify() {
    //.filter(user => !!user) // filter null
    // take first real user
    this.auth.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.notifyService.requestPermission();
        this.notifyService.monitorRefresh(user);
        this.notifyService.receiveMessage();

        //this.notifyService.getPermission(user)
        //this.notifyService.monitorRefresh(user)
        //this.notifyService.receiveMessages()
      }
    });
  }

  goToDash() {
    this.auth.user$.pipe(take(1)).subscribe((mine: any) => {
      if (mine) {
        console.log('MINE', mine);
        if (mine.admin) {
          this.auth.resource.router.navigate(['/dash']);
        } else {
          this.auth.signOut();
          this.auth.resource.startSnackBar(
            'You are not authorized to access this.'
          );
          this.auth.resource.router.navigate(['/404']);
        }
        // if(mine.storeLoc.length > 0){
        //   if(mine.storeCam.length > 0){
        //     this.auth.resource.router.navigate(['/dash']);
        //   }else{
        //     this.auth.resource.router.navigate(['/store/create-campaign']);
        //   }
        // }else{
        //   this.auth.resource.router.navigate(['/store/create-location']);
        // }
        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
      }
    });
  }
}
