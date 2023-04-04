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

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    public depends: DependencyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.slideNow = 1;
    this.execute();
  }

  execute() {
    this.auth.resource
      .internetConnected()
      .then((netX) => {
        if (!netX) {
          this.offlineSetup();
        } else {
          setTimeout(() => {

            this.auth.user$.pipe(take(1)).subscribe((mine) => {
              if (!mine) {
                this.showWeb = true;
                if (
                  !this.auth.resource.appMode &&
                  !this.auth.resource.updateAvil
                ) {
                  this.openSignDialog();
                }
              } else {
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
                }
                this.showWeb = true;
              }
            });
          }, 3000);
        }
      })
      .catch((err) => {
        this.offlineSetup();
      });
  }

  offlineSetup() {
    const snackBarRef = this.snackBar.open('You are offline.', 'Retry', {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });

    snackBarRef.onAction().subscribe(() => {
      this.execute();
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
      panelClass: ['dialogLayout', 'dialogSign'],
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
