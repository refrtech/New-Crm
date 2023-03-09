import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, take } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DependencyService } from 'src/app/dependency.service';
import { ThemeService } from 'src/app/theme.service';
import { SignComponent } from './sign/sign.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  showWeb = false;
  slideNow = 1;
  // net1 = false;
  // net2 = false;
  // net3 = false;
  // net4 = false;
  // net5 = false;
  // net6 = false;
  // net7 = false;
  // net8 = false;
  // net9 = false;
  // net10 = false;
  // errX:any;

  //isLoading = true;
  // wt1 = false;
  // wt2 = false;
  // wt3 = false;
  // wt4 = false;

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    public depends: DependencyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //   console.log("MINE", "mine0")
    //   this.wt1 = true;
    // this.auth.user$.subscribe(mine =>{
    //       this.wt2 = true;
    //   if(!mine){
    //     this.wt3 = true;
    //     console.log("MINE1")
    //   }else{
    //     this.wt4 = true;
    //     console.log("MINE2", mine)
    //   }
    // })
    // .pipe(finalize(() => {
    //     this.isLoading = false; this.wt4 = true;
    //     console.log('complete!')
    //     return "444"
    // }))
    // .subscribe({
    //     next: (v) => {
    //       console.log("nextZ ", v)
    //       this.isLoading = false; this.wt1 = true;
    //       return "111"
    //   },
    //     error: (e) => {
    //       console.error("errorZ ", e)
    //       this.isLoading = false; this.wt2 = true;
    //       return "222"
    //     },
    //     complete: () => {
    //       console.info('completeZ')
    //       this.isLoading = false; this.wt3 = true;
    //       return "333"
    //     }
    // })
    // .pipe(finalize(() =>
    // {this.isLoading = false; this.wt3 = true; console.log("Final Exam");}
    // ))/*.pipe(take(1))*/.subscribe(
    //   success => {this.isLoading = false; this.wt1 = true; console.log("success",success);},
    //   error => {this.isLoading = false; this.wt2 = true; console.log("error", error);},
    //   //() => {this.isLoading = false; this.wt3 = true; console.log("Final Exam");}
    //   /*
    //   mine => {
    //   console.log("MINE", mine)
    // }*/
    // )
  }

  ngAfterViewInit() {
    this.slideNow = 1;
    this.execute();
  }

  execute() {
    // this.net1 = true;
    this.auth.resource
      .internetConnected()
      .then((netX) => {
        // this.net2 = true;
        console.log('NetworkX T', netX);
        if (!netX) {
          // this.net3 = true;
          console.log('No Internet');
          this.offlineSetup();
        } else {
          // this.net4 = true;

          //this.auth.resource.onlineOffline().pipe(take(1)).subscribe(net => {
          //console.log("Network", net)
          //if( net ){
          /*
        this.depends.getState().pipe(take(1)).subscribe((getStateRes: any) => {
          // {
          //   vr: 101.1, 
          //   web:1.1, andi: 1.1, ios: 1.1,
          //   env: enviroment.prod,
          //   code:"Albatrosses", date: 1644195271637
          // }
          if(
            !getStateRes || 
            getStateRes.vr > environment.refrBot.vr ||
            getStateRes.web > environment.refrBot.web
            // getStateRes.andi > environment.andi
            // getStateRes.ios > environment.ios
            ){
            // vr check
            // device check
            // os check
            this.openBottomSheet(getStateRes)
          }else{
            this.auth.resource.foreignMarks = getStateRes.markets;*/
          console.log('user2');
          setTimeout(() => {
            // this.net5 = true;
            console.log('user1');

            // try{
            // this.net6 = true;

            this.auth.user$.pipe(take(1)).subscribe((mine) => {
              console.log('user', mine);
              // this.net7 = true;
              if (!mine) {
                // this.net8 = true;
                this.showWeb = true;
                if (
                  !this.auth.resource.appMode &&
                  !this.auth.resource.updateAvil
                ) {
                  this.openSignDialog();
                }
              } else {
                // this.net9 = true;
                if (mine.storeLoc.length > 0) {
                  if (mine.storeCam.length > 0) {
                    this.auth.resource.router.navigate(['/dash']);
                  } else {
                    // GO TO CREATE CAMP
                    this.auth.resource.router.navigate([
                      '/store/create-campaign',
                    ]);
                  }
                } else {
                  this.auth.resource.router.navigate([
                    '/store/create-location',
                  ]);
                  //this.activeNow = "createLocation";
                }
                this.showWeb = true;
              }
            });

            // }catch(errX){
            //   // this.net10 = true;
            //   // this.errX = errX;
            //   console.log("errX",errX)
            //   this.offlineSetup();
            // }
          }, 3000); /*
          }

        });
    */

          //}else{
          //this.offlineSetup();
          //}

          //})
        }
      })
      .catch((err) => {
        console.log('NetworkX C', err);
        this.offlineSetup();
      });
  }

  offlineSetup() {
    const snackBarRef = this.snackBar.open('You are offline.', 'Retry', {
      //duration: 2000, //panelClass:["b_accent","c_light"],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });

    snackBarRef.onAction().subscribe(() => {
      this.execute();
      console.log('The snackbar action was triggered!');
    });
  }

  openSignDialog() {
    let isPhone = this.auth.resource.getWidth < 768;
    let w = isPhone ? this.auth.resource.getWidth + 'px' : '480px';
    let h = isPhone ? this.auth.resource.getHeight + 'px' : '';
    const refDialog = this.auth.resource.dialog.open(SignComponent, {
      width: w,
      minWidth: '320px',
      maxWidth: '480px',
      height: h,
      hasBackdrop: false,
      disableClose: true,
      panelClass: ['dialogLayout', 'dialogSign'], //, autoFocus:false
    });
    refDialog.afterClosed().subscribe(() => {
      this.auth.step = 0;
      this.auth.stepDisable = false;
      this.auth.verificationId = '';
      this.auth.resource.first.setValue('');
      this.auth.resource.last.setValue('');
      this.auth.resource.pass.setValue('');
      this.auth.resource.first.enable();
      this.auth.resource.last.enable();
      this.auth.resource.pass.enable();
    });
  }
}
