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
    this.phoneNumber.area = this.phoneNumFull.slice(0, 3);
    this.phoneNumber.prefix = this.phoneNumFull.slice(3, 6);
    this.phoneNumber.line = this.phoneNumFull.slice(6, this.phoneNumber.digits);
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
        if (!data.success) {
          this.finalRESULT(data);
        } else {
          if (!data.exist) {
            this.auth.stepDisable = false;
            this.auth.resource.startSnackBar('No such account exists.');
          } else {
            this.auth.verifyPhoneWithOTPX(phone, false).then((dataV) => {
              if (!dataV.success) {
                this.finalRESULT(dataV);
              } else {
                this.auth.stepDisable = false;
                this.auth.step = 5;
              }
            });
          }
        }
      });
    }
  }

  step1X() {
    //CREATE NEW USER
    this.auth.resource.first.disable();

    let validatePassword = this.auth.resource.pass.value;
    if (this.auth.resource.invalidPassword(validatePassword)) {
      this.auth.resource.first.enable();
      this.verificationCode = '';
      this.auth.resource.startSnackBar('issue: format must be 0-9A-Za-z@.');
    } else {
      const name = this.auth.resource.first?.value;
      if (this.verificationCode?.length < 6) {
        this.auth.resource.startSnackBar('issue: verification code invalid.');
      } else {
        this.auth.confirmationResult
          .confirm(this.verificationCode)
          .then((credential: any) => {
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
          })
          .catch((err: any) => {
            console.error(err);
            this.verificationCode = '';
            this.auth.resource.startSnackBar(err);
          });
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
          this.goToDash();
        })
        .catch((err: any) => {
          this.verificationCode = '';
          this.auth.resource.startSnackBar(err);
        });
    }
  }

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
  }

  signWithSocial(cred: any, medium: string) {
    const step0_CheckUserExist = this.auth.step0_socialForward(
      cred.uid,
      cred.email
    );

    step0_CheckUserExist.then((ref) => {
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
          });
        } else {
          this.goToDash();
        }
      }
    });
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
    this.auth.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.notifyService.requestPermission();
        this.notifyService.monitorRefresh(user);
        this.notifyService.receiveMessage();
      }
    });
  }

  goToDash() {
    this.auth.user$.pipe(take(1)).subscribe((mine: any) => {
      if (mine) {
        if (mine.admin) {
          this.auth.resource.router.navigate(['/dash']);
        } else {
          this.auth.signOut();
          this.auth.resource.startSnackBar(
            'You are not authorized to access this.'
          );
          this.auth.resource.router.navigate(['/404']);
        }
        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
      }
    });
  }
}
